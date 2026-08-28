using System;
using System.Diagnostics;
using System.IO;

namespace AselaScanner
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.Title = "ASELA SCANNER - Multi-Page SERP Harvester";
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("=======================================================");
            Console.WriteLine("       ASELA SCANNER - SERP Harvester (v2.5)          ");
            Console.WriteLine("=======================================================\n");
            Console.ResetColor();

            string appDir = AppDomain.CurrentDomain.BaseDirectory;
            string targetFile = Path.Combine(appDir, "dist", "bundle.cjs");
            
            if (!File.Exists(targetFile))
            {
                targetFile = Path.Combine(appDir, "standalone-app.cjs");
            }

            if (!File.Exists(targetFile))
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[HATA] Gerekli dosyalar (dist/bundle.cjs) bulunamadi!");
                Console.WriteLine("Lutfen derle-asela.bat dosyasini calistirarak projeyi derleyin.");
                Console.ResetColor();
                Console.WriteLine("\nCikmak icin bir tusa basin...");
                Console.ReadKey();
                return;
            }

            string nodeCmd = "node";
            string arguments = "\"" + targetFile + "\"";
            if (args != null && args.Length > 0)
            {
                arguments += " " + string.Join(" ", args);
            }

            ProcessStartInfo psi = new ProcessStartInfo
            {
                FileName = nodeCmd,
                Arguments = arguments,
                WorkingDirectory = appDir,
                UseShellExecute = false
            };

            try
            {
                using (Process proc = Process.Start(psi))
                {
                    proc.WaitForExit();
                }
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[HATA] Baslatilamadi: " + ex.Message);
                Console.ResetColor();
                Console.WriteLine("\nCikmak icin bir tusa basin...");
                Console.ReadKey();
            }
        }
    }
}
