#! /usr/bin/env -S awk -f

BEGINFILE {
  print \
  "<details>\n" \
  "<summary>INSERT SITE NAME</summary>\n" \
}

/const hotkeys/ {
  start = true
  print \
  "| Shortcut | Description |\n" \
  "| -------- | ----------- |" \
}

start == true && /category:/ {
  match($0, /category:.*'(.+)'/, categoryArr)
  category = categoryArr[1]
  if (category != lastCategory) {
    lastCategory = category
    printf "| **%s** |\n", category
  }
}

start == true && /'.'.*{/ {
  verbatum = ""
  match($0, /'(.)'/, shortcutArr)
  shortcut = shortcutArr[1]
}

start == true && /description:/ {
  match($0, /description:.*'(.+)'/, descriptionArr)
  description = descriptionArr[1]
}

start == true && /verbatum:/ {
  match($0, /verbatum:.*'(.+)'/, verbatumArr)
  verbatum = verbatumArr[1]
  gsub(/[^+]+/, "<kbd>&</kbd>", verbatum)
  verbatum = sprintf(" (%s)", verbatum)
}

start == true && /event:/ {
  printf "| <kbd>%s</kbd>%s | %s |\n", shortcut, verbatum, description
}

ENDFILE {
  print "\n</details>\n\n<br>\n"
}
