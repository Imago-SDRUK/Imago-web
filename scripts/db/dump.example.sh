#!/bin/zsh

echo "Starting"

PGHOST=<remote db url>
PGUSER=<remote db user>
PGPASSWORD=<remote db user password>
DATABASES=(<databases>)

date=$(date +"%Y_%m_%d_%H-%M-%S")
mkdir "./backups/$date"
for i in "${DATABASES[@]}"; do
  echo $PGHOST
  echo "Dumping $i.sql"
  PGHOST=$PGHOST PGUSER=$PGUSER PGPASSWORD=$PGPASSWORD pg_dump --no-owner --no-privileges -d $i >"./backups/$date/$i.sql"
done

echo "Done"
