function done_command {
  history 1 | sed -e "s/^[ ]*[0-9]*[ ]*//g"
}

function escape {
  echo $1 | sed -e "s/\"/\\\\\"/g" | sed -e "s/\\\/\\\\\\\/g"
}

function post_notification {
  local escaped=`escape "$2"`
  curl -XPOST http://127.0.0.1:16661/ -H "Content-Type: application/json" --data "{\"title\":\"$1\",\"message\":\"$escaped\"}" -w ""
}

function first_word {
  echo $1 | sed -e "s/^([^ ]+)(.*)$/\1/g"
}

function prompt {
  local the_command=`done_command`

  if [[ $? -gt 0 ]];then
    post_notification "Command FAILED" "$the_command"
  else
    post_notification "Command OK" "$the_command"
  fi
}

PROMPT_COMMAND=prompt

# Path de rsync
export PATH=/c/cygwin/bin:$PATH:/c/HashiCorp/Vagrant/bin