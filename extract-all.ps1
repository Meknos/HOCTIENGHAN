# Chạy script này trong PowerShell tại thư mục HOCTIENGHAN:
# cd D:\DEV\HOCTIENGHAN
# .\extract-all.ps1

Write-Host "=== Khoi dong extraction tat ca sach ===" -ForegroundColor Cyan

# Buoc 1: Cap nhat Prisma schema
Write-Host "`n[1/8] npx prisma db push..." -ForegroundColor Yellow
npx prisma db push

# Buoc 2: Extract tung quyen
$books = @(
    "data/snu-1a.toc.json",
    "data/snu-1b.toc.json",
    "data/snu-2a.toc.json",
    "data/snu-2b.toc.json",
    "data/snu-3a.toc.json",
    "data/snu-3b.toc.json"
)

$i = 2
foreach ($toc in $books) {
    $slug = [System.IO.Path]::GetFileNameWithoutExtension($toc) -replace '\.toc', ''
    Write-Host "`n[$i/8] Extract $slug ..." -ForegroundColor Yellow
    npx tsx scripts/extract-book.ts $toc
    $i++
}

# Buoc 8: Seed vao DB
Write-Host "`n[8/8] npm run seed..." -ForegroundColor Yellow
npm run seed

Write-Host "`n=== HOAN THANH! ===" -ForegroundColor Green
Write-Host "Tat ca du lieu da duoc seed vao DB." -ForegroundColor Green
