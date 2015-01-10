========================
Inyoka ubuntuusers Theme
========================

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
3. Install as a development package: ``python setup.py develop``

On Production
-------------

1. Run ``pip install -U "git+ssh://git@github.com:inyokaproject/theme-ubuntuusers.git@staging#egg=inyoka-theme-ubuntuusers"``

Building
~~~~~~~~

1. Run ``npm install`` to install grunt with lesscss support
2. Run ``./node_modules/grunt-cli/bin/grunt`` to build all static files
3. Run ``manage.py collectstatic`` in you Django project

Let Django know about the theme
-------------------------------

Add ``'inyoka_theme_ubuntuusers'`` to the ``INSTALLED_APPS`` in
``inyoka/development_settings.py``::

    INSTALLED_APPS = INSTALLED_APPS + (
        'inyoka_theme_ubuntuusers',
    )
