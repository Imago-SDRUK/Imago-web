#!/bin/zsh

echo "Starting"

PGHOST=127.0.0.1
PGPORT=5432
PGUSER=<local pg user>
PGPASSWORD=<local pb password>
DATABASES=()
TEST_USER=ckan_ro

if [[ $1 = '' ]]; then
  echo "You need to provide a path"
  exit 1
fi

PGHOST=$PGHOST PGPORT=$PGPORT PGUSER=$PGUSER PGPASSWORD=$PGPASSWORD psql -d postgres -c "CREATE ROLE $TEST_USER WITH LOGIN PASSWORD '$PGPASSWORD' "

for i in "${DATABASES[@]}"; do
  echo "Pushing $1/$i.sql"
  PGHOST=$PGHOST PGPORT=$PGPORT PGUSER=$PGUSER PGPASSWORD=$PGPASSWORD psql -d postgres -c "CREATE DATABASE $i"
  PGHOST=$PGHOST PGPORT=$PGPORT PGUSER=$PGUSER PGPASSWORD=$PGPASSWORD psql -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $i TO $PGUSER"
  PGHOST=$PGHOST PGPORT=$PGPORT PGUSER=$PGUSER PGPASSWORD=$PGPASSWORD psql -d $i <"$1/$i.sql"

  if [[ $i = 'ckan_dev_datastore' ]] || [[ $i = 'ckan_dev_datastore_test' ]]; then
    PGHOST=$PGHOST PGPORT=$PGPORT PGUSER=$PGUSER PGPASSWORD=$PGPASSWORD psql -d postgres -c "GRANT CONNECT ON DATABASE $i TO $TEST_USER"
  fi
done

echo "Done"
