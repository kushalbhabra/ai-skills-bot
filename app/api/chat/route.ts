import path from "node:path";
import { createAnthropic } from "@ai-sdk/anthropic";
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai";
import {
  createBashTool,
  experimental_createSkillTool as createSkillTool,
} from "bash-tool";

const anthropic = createAnthropic();

const SKILLS_DIR = path.join(process.cwd(), "skills");

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // 1. Discover skills from the skills/ directory
  const { skill, skills, files, instructions } = await createSkillTool({
    skillsDirectory: SKILLS_DIR,
  });

  // 2. Create a fresh just-bash InMemoryFs sandbox per request
  //    No sandbox option = just-bash InMemoryFs is the default backend
  //    Skill scripts pre-loaded into /workspace/skills/ in the virtual FS
  //    Completely isolated per request, no state leaks between users
  const { tools } = await createBashTool({
    files,
    extraInstructions: instructions,
  });

  // 3. Convert UI messages to model messages
  const modelMessages = await convertToModelMessages(messages);

  // 4. Stream response with skill + bash tools
  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
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

