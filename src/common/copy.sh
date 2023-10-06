#!/bin/bash

# 获取txt文件名
filename=$1

# 循环复制1000份
for i in {1..1000}; do
  # 生成新文件名
  new_filename="chapter_$i.json"

  # 复制文件
  cp "$filename" "$new_filename"
done
