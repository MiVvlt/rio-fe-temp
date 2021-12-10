#!/bin/bash

# https://api-rio.azure-api.net
# device 

echo $1
echo $2

curl $1'/push-notification' -i -X POST \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "{
  \"to\" : \"$2\",
  \"title\" : \"Planningpush\",
  \"body\" : \"This is a planning push message\",
  \"type\" : \"PLANNINGPUSH\",
  \"reference\" : \"reference\"
}"

sleep 10

curl $1'/push-notification' -i -X POST \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "{
  \"to\" : \"$2\",
  \"title\" : \"CHANGEPUSH\",
  \"body\" : \"This is a changepush push message\",
  \"type\" : \"CHANGEPUSH\",
  \"reference\" : \"reference\"
}"

sleep 10

curl $1'/push-notification' -i -X POST \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "{
  \"to\" : \"$2\",
  \"title\" : \"LOCK\",
  \"body\" : \"This is a lock push message\",
  \"type\" : \"LOCK\",
  \"reference\" : \"reference\"
}"

sleep 10

curl $1'/push-notification' -i -X POST \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "{
  \"to\" : \"$2\",
  \"title\" : \"CHANGEREQUEST\",
  \"body\" : \"This is a changerequst push message\",
  \"type\" : \"CHANGEREQUEST\",
  \"reference\" : \"reference\"
}"

sleep 10

curl $1'/push-notification' -i -X POST \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "{
  \"to\" : \"$2\",
  \"title\" : \"SWITCHPUSH\",
  \"body\" : \"This is a switchpush push message\",
  \"type\" : \"SWITCHPUSH\",
  \"reference\" : \"reference\"
}"

sleep 10

curl $1'/push-notification' -i -X POST \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "{
  \"to\" : \"$2\",
  \"title\" : \"Hello\",
  \"body\" : \"This is a switchrequest push message\",
  \"type\" : \"SWITCHREQUEST\",
  \"reference\" : \"reference\"
}"

sleep 10

curl $1'/push-notification' -i -X POST \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "{
  \"to\" : \"$2\",
  \"title\" : \"Hello\",
  \"body\" : \"This is a validate push message\",
  \"type\" : \"VALIDATE\",
  \"reference\" : \"reference\"
}"













