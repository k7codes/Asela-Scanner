const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("\n=======================================================");
console.log("       ASELA SCANNER - Otomatik Derleme Motoru        ");
console.log("=======================================================\n");

// 1. Frontend and Backend Bundle
console.log("[1/3] Frontend ve backend kaynakları derleniyor...");
try {
  execSync("npx vite build", { stdio: "inherit" });
  execSync("npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs", { stdio: "inherit" });
  execSync("npx esbuild standalone-app.cjs --bundle --platform=node --format=cjs --outfile=dist/bundle.cjs", { stdio: "inherit" });
  console.log("    [OK] JavaScript ve CSS paketleri başarıyla oluşturuldu.");
} catch (err) {
  console.error("[!] Paketleme hatası:", err.message);
}

// 2. Compile asela-scanner.exe using Windows C# Compiler (csc.exe / PowerShell)
console.log("\n[2/3] Bağımsız Windows 'asela-scanner.exe' derleniyor...");

let exeCreated = false;

// Search for csc.exe in standard Windows .NET paths
const cscPaths = [
  "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe",
  "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe",
  "C:\\Windows\\Microsoft.NET\\Framework64\\v3.5\\csc.exe",
  "C:\\Windows\\Microsoft.NET\\Framework\\v3.5\\csc.exe"
];

let foundCsc = cscPaths.find(p => fs.existsSync(p));

if (foundCsc && fs.existsSync("asela-launcher.cs")) {
  try {
    console.log(`    -> Windows .NET Derleyicisi bulundu: ${foundCsc}`);
    execSync(`"${foundCsc}" /target:exe /out:asela-scanner.exe asela-launcher.cs`, { stdio: "inherit" });
    if (fs.existsSync("asela-scanner.exe")) {
      exeCreated = true;
      console.log("    [OK] asela-scanner.exe başarıyla derlendi!");
    }
  } catch (e) {
    console.log("    -> csc.exe denendi, alternatif PowerShell derleyicisine geçiliyor...");
  }
}

// Fallback to PowerShell Add-Type if csc directly wasn't called
if (!exeCreated && fs.existsSync("asela-launcher.cs")) {
  try {
    console.log("    -> PowerShell C# Derleyici kullanılıyor...");
    const psCmd = `powershell -Command "Add-Type -TypeDefinition (Get-Content -Raw 'asela-launcher.cs') -OutputAssembly 'asela-scanner.exe' -OutputType ConsoleApplication"`;
    execSync(psCmd, { stdio: "inherit" });
    if (fs.existsSync("asela-scanner.exe")) {
      exeCreated = true;
      console.log("    [OK] PowerShell ile asela-scanner.exe başarıyla oluşturuldu!");
    }
  } catch (e) {
    console.log("    -> PowerShell derleme atlandı.");
  }
}

console.log("\n=======================================================");
if (exeCreated) {
  console.log("  >>> TEBRİKLER! asela-scanner.exe BAŞARIYLA OLUŞTURULDU! <<<");
  console.log("  Klasörünüzdeki 'asela-scanner.exe'ye çift tıklayarak çalıştırabilirsiniz.");
} else {
  console.log("  [BİLGİ] 'baslat-asela.bat' ile tek tıkla başlatabilirsiniz.");
}
console.log("=======================================================\n");
