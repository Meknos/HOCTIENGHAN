#!/bin/bash
set -e
LOG="/sessions/focused-gallant-meitner/mnt/HOCTIENGHAN/data/extract.log"
echo "[$(date)] Bat dau extract tat ca sach" | tee -a "$LOG"

BOOKS="snu-1a snu-1b snu-2a snu-2b snu-3a snu-3b"
for slug in $BOOKS; do
  echo "[$(date)] === $slug ===" | tee -a "$LOG"
  npx tsx scripts/extract-book.ts "data/${slug}.toc.json" 2>&1 | tee -a "$LOG"
  echo "[$(date)] Xong $slug" | tee -a "$LOG"
done

echo "[$(date)] HOAN THANH TAT CA" | tee -a "$LOG"
