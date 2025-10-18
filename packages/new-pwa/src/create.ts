import * as fs from "fs-extra";
import { readFile, writeFile, readdir } from "fs/promises";
import * as path from "path";
import prompts from "prompts";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface CreateOptions {
  yes?: boolean;
  template?: "cdn" | "build";
}

export async function create(projectName?: string, options: CreateOptions = {}) {
  // Always create in current directory
  const projectPath = process.cwd();
  const files = await readdir(projectPath);

  // Allow .git and .gitignore files
  const nonGitFiles = files.filter((f) => f !== ".git" && f !== ".gitignore");
  if (nonGitFiles.length > 0) {
    console.error(
      `Error: Current directory is not empty. Please run this command in an empty directory (git clone works great!).`,
    );
    process.exit(1);
  }

  // Get additional information via prompts (unless --yes flag)
  let experimentTitle = path.basename(projectPath);
  let templateChoice: "cdn" | "build" = options.template || "cdn";

  if (!options.yes) {
    const responses = await prompts([
      {
        type: "text",
        name: "experimentTitle",
        message: "Experiment title:",
        initial: experimentTitle,
      },
      {
        type: "select",
        name: "template",
        message: "Choose template:",
        choices: [
          {
            title: "CDN imports (no build step, easier to modify)",
            value: "cdn",
            description: "Uses CDN for dependencies, plain JavaScript, no build required",
          },
          {
            title: "npm packages (with build step, TypeScript)",
            value: "build",
            description: "Uses npm packages, TypeScript, Vite build process",
          },
        ],
        initial: 0,
      },
    ]);

    if (responses.experimentTitle !== undefined) {
      experimentTitle = responses.experimentTitle;
    }
    if (responses.template !== undefined) {
      templateChoice = responses.template;
    }
  }

  console.log(`\nCreating new offline jsPsych experiment in current directory...`);
  console.log(`Using ${templateChoice === "cdn" ? "CDN" : "build"} template\n`);

  // Copy appropriate template directory
  const templateDir = path.join(__dirname, `../template-${templateChoice}`);
  await fs.copy(templateDir, projectPath);

  // Read offline-storage version
  const offlineStoragePkgPath = path.join(__dirname, "../../offline-storage/package.json");
  const offlineStoragePkg = JSON.parse(await readFile(offlineStoragePkgPath, "utf-8"));
  const offlineStorageVersion = offlineStoragePkg.version;

  // Process template variables in files
  const packageName = path.basename(projectPath);
  await replaceInFile(path.join(projectPath, "package.json"), {
    "{{name}}": packageName,
  });

  await replaceInFile(path.join(projectPath, "README.md"), {
    "{{title}}": experimentTitle,
  });

  // Template-specific file updates
  if (templateChoice === "cdn") {
    await replaceInFile(path.join(projectPath, "index.html"), {
      "{{title}}": experimentTitle,
      "{{offlineStorageVersion}}": offlineStorageVersion,
    });

    await replaceInFile(path.join(projectPath, "admin/index.html"), {
      "{{title}}": experimentTitle,
      "{{offlineStorageVersion}}": offlineStorageVersion,
    });

    await replaceInFile(path.join(projectPath, "service/sw.js"), {
      "{{offlineStorageVersion}}": offlineStorageVersion,
    });

    await replaceInFile(path.join(projectPath, "manifest.json"), {
      "{{title}}": experimentTitle,
    });
  } else {
    await replaceInFile(path.join(projectPath, "public/index.html"), {
      "{{title}}": experimentTitle,
    });

    await replaceInFile(path.join(projectPath, "public/admin.html"), {
      "{{title}}": experimentTitle,
    });

    await replaceInFile(path.join(projectPath, "public/manifest.json"), {
      "{{title}}": experimentTitle,
    });
  }

  console.log("✓ Project created successfully!\n");

  // Show template-specific instructions
  if (templateChoice === "cdn") {
    console.log("Next steps:");
    console.log(`  1. npm run dev`);
    console.log("\nNo build step needed! Just edit the JavaScript files and refresh.\n");
    console.log("To deploy:");
    console.log("  - Push to GitHub and enable GitHub Pages (see README.md)");
    console.log("  - Install as PWA on tablets using 'Add to Home Screen'\n");
  } else {
    console.log("Next steps:");
    console.log(`  1. npm install`);
    console.log(`  2. npm run dev`);
    console.log("\nTo build for production:");
    console.log(`  npm run build`);
    console.log("\nTo deploy:");
    console.log("  - Push to GitHub and enable GitHub Pages (see README.md)\n");
  }

  console.log("For detailed instructions, see README.md");
}

async function replaceInFile(
  filePath: string,
  replacements: Record<string, string>,
): Promise<void> {
  let content = await readFile(filePath, "utf-8");

  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replace(new RegExp(search, "g"), replace);
  }

  await writeFile(filePath, content);
}
