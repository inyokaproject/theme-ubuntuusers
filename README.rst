========================
Inyoka ubuntuusers Theme
========================

.. image:: https://ci.ubuntu-de.org/job/inyokaproject-github/job/theme-ubuntuusers/job/staging/badge/icon
    :target: https://ci.ubuntu-de.org/job/theme-ubuntuusers/
    :alt: Build status of the staging branch

Installation
============

On development systems:
-----------------------

1. Run ``git clone git@github.com:inyokaproject/theme-ubuntuusers.git`` next to
   the cloned Inyoka repository. (Basically, it doesn't matter were you clone
   the theme repository, but for support reasons it might be better to use the
   same base folder like for Inyoka). After cloning the file-structure should
   look like::

        $ tree -L 1
        .
        ├── inyoka
        ├── theme-ubuntuusers
        └── maybe another-theme

2. Switch into the repository: ``cd theme-ubuntusers``
3. Activate source ``source ~/.venvs/inyoka/bin/activate``
4. Install as a development package: ``python setup.py develop``
5. Run ``npm install`` to install *Grunt*
6. If you get the error ``/usr/bin/env: node: No such file or directory``, you should create a symbolic link: ``sudo ln -s /usr/bin/nodejs /usr/bin/node``
7. Run ``./node_modules/grunt-cli/bin/grunt watch`` to build all static files
   and watch for file changes on the CSS / JS files
8. Open a new terminal and let Django know about the theme. Add ``'inyoka_theme_ubuntuusers'`` to the
   ``INSTALLED_APPS`` in ``inyoka/development_settings.py``::

       INSTALLED_APPS = INSTALLED_APPS + (
           'inyoka_theme_ubuntuusers',
       )

On Production
-------------

1. Run ``pip install -U "git+ssh://git@github.com:inyokaproject/theme-ubuntuusers.git@staging#egg=inyoka-theme-ubuntuusers"``

Deployment
----------

1. Run ``npm install`` to install *Grunt*
2. Run ``./node_modules/grunt-cli/bin/grunt`` to build all static files
3. Run ``python manage.py collectstatic`` in your inyoka instance
