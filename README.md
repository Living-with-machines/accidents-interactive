Accidents interactive
===============

This is the “accidents interactive” for the _Living with Machines_ exhibit at Leeds City Museum 2022–23.

To run the kiosk using Python
---------------

1. Run the build command:

```sh
$ bash build.sh
```

2. Navigate into the `build` folder:

```sh
$ cd build
```

3. Run the command:

```sh
$ python -m http.server 80
```

_Prerequisites:_ Note that this means Python 3.7 or above must be installed, you must have made the correct settings to run `python3` using the `python` command (otherwise, you could just switch `python` for `python3` above). If you need installation instructions for how to install Python 3 this way, Lisa Tagliaferri’s instructions are recommended, either for [macOS](https://www.digitalocean.com/community/tutorials/how-to-install-python-3-and-set-up-a-local-programming-environment-on-macos), [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-python-3-and-set-up-a-programming-environment-on-an-ubuntu-20-04-server) or [Windows 10](https://www.digitalocean.com/community/tutorials/how-to-install-python-3-and-set-up-a-local-programming-environment-on-windows-10).

You should now have a local web server running on port 80, which means that you can:

4. Navigate to [localhost](http://localhost) (or 127.0.0.1) in your browser.

To run the kiosk using NodeJS
---------------

You can also opt to run the kiosk using NodeJS if you would like. First, make sure you have NodeJS installed. Then, follow these steps:

1. Run the command:

```
$ bash build.sh
```

2. Navigate into the `build` folder:

```sh
$ cd build
```

3. Run the command:

```
$ npx http-server --port 80
```

4. Navigate to [localhost](http://localhost) (or 127.0.0.1) in your browser.
