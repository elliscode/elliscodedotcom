# Setup

```
~/Python311/Scripts/pipenv lock
```

```
~/Python311/Scripts/pipenv sync
```

```
~/Python311/Scripts/pipenv run manage.py collectstatic
```

```
~/Python311/Scripts/pipenv run manage.py migrate
```

# Run

```
~/Python311/Scripts/pipenv run server.py
```

# Cache and secrets folder layout

- `$HOME/elliscodedotcom`
    - `secret-key.txt` &mdash; automatically generated on the startup of the server, see `/elliscodedotcom/settings.py`