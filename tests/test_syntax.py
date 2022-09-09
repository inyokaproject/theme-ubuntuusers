from __future__ import unicode_literals

import os
import unittest

from jinja2 import Environment, FileSystemLoader

from inyoka_theme_ubuntuusers import INYOKA_THEME


def mkdummy(name):
    def dummy(*args, **kwargs):
        return name
    return dummy


def mkenv(root):
    env = Environment(
        loader=FileSystemLoader(root),
        extensions=['jinja2.ext.i18n', 'jinja2.ext.do']
    )

    env.globals.update(
        INYOKA_VERSION=None,
        SETTINGS=None,
        REQUEST=None,
        href=mkdummy('href-link'),
        csrf_token=lambda: 'csrf_token-content'
    )

    for n in ('date', 'datetime', 'hnumber', 'ischeckbox', 'jsonencode',
               'naturalday', 'time', 'timetz', 'timedeltaformat', 'url', 'urlencode'):
        env.filters[n] = mkdummy(n)

    return env


class TestTemplateSyntax(unittest.TestCase):

    def setUp(self):
        self.env = mkenv(root)


def main(root):

    def gen_test_func(template_name):
        def test_func(self):
            self.env.get_template(template_name)
        return test_func

    for path, dirs, files in os.walk(root):
        for file in files:
            name = os.path.relpath(os.path.join(path, file), root)
            func_name = 'test_%s' % name.replace('/', '__').replace('.', '_')
            setattr(TestTemplateSyntax, func_name, gen_test_func(name))


root = os.path.join(INYOKA_THEME, 'jinja2')
main(root)
