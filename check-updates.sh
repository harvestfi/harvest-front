while true; do
    if git pull | grep -q 'Already up to date.'; then
        echo "Not git updates to pull"
    else
        echo "Git updates pulled. Proceeding with updates and restart"
        git submodule update --remote --merge
        yarn install
	yarn build
        yarn pm:restart-ui
    fi
    sleep 300 # Sleep for 5 minutes
done

