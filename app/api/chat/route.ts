import path from "node:path";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import {
  createBashTool,
  experimental_createSkillTool as createSkillTool,
} from "bash-tool";
import { getConfiguredModel } from "@/app/lib/model";

const SKILLS_DIR = path.join(process.cwd(), "skills");

// Skill files are static — discover once and reuse across all requests.
type SkillToolResult = Awaited<ReturnType<typeof createSkillTool>>;
let skillToolCache: SkillToolResult | null = null;
async function getSkillTools(): Promise<SkillToolResult> {
  if (!skillToolCache) {
    skillToolCache = await createSkillTool({ skillsDirectory: SKILLS_DIR });
  }
  return skillToolCache;
}

// One bash sandbox per chat session so the AI can build on previous steps.
type BashTools = Awaited<ReturnType<typeof createBashTool>>["tools"];
const sessionSandboxes = new Map<string, BashTools>();

async function getSessionBashTools(
  chatId: string,
  files: Record<string, string>,
  instructions: string
): Promise<BashTools> {
  if (!sessionSandboxes.has(chatId)) {
    const { tools } = await createBashTool({ files, extraInstructions: instructions });
    sessionSandboxes.set(chatId, tools);
  }
  return sessionSandboxes.get(chatId)!;
}

export async function POST(req: Request) {
  const { messages, id: chatId = crypto.randomUUID() }: { messages: UIMessage[]; id?: string } =
    await req.json();

  // 1. Discover skills (cached — reads filesystem once per server lifetime)
  const { skill, skills, files, instructions } = await getSkillTools();

  // 2. Reuse the existing sandbox for this chat session, or create one on first turn.
  //    State written in turn 1 (e.g. uploaded CSV) is available in turn 2+.
  const tools = await getSessionBashTools(chatId, files, instructions);

  // 3. Convert UI messages to model messages
  const modelMessages = await convertToModelMessages(messages);

  // 4. Stream response with skill + bash tools
  const result = streamText({
    model: getConfiguredModel(),
    system: `You are a data processing assistant with access to bash skills.

Available skills: ${skills.map((s) => s.name).join(", ")}

How to use skills:
1. Call the "skill" tool with a skill name to get its full instructions
2. Use the "bash" tool to run the skill scripts
3. Skills are located at ./skills/<skill-name>/scripts/

${instructions}`,
    messages: modelMessages,
    tools: {
      skill,
      bash: tools.bash,
    },
    stopWhen: stepCountIs(20),
  });

  return result.toUIMessageStreamResponse();
}

