# -*- coding: utf-8 -*-
{
    'name': "Custom Dashboard",

    'summary': " ",

    'description': " ",

    'author': " ",
    'website': " ",
    'category': 'Education',
    'version': '16.0.1',

    'depends': [
        'base',
        'product',
        'account',
        'sale',
        'web',
        # 'base_setup',
        # 'mail',
        # 'website',
        'smartedu_core',
        # 'web_tour',
        # 'web_kanban_gauge',
    ],

    # always loaded
    'data': [
        'views/dashboard_action.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        # 'demo/demo.xml',
    ],

    'assets': {
        'web.assets_backend': [
            'custom_dashboard/static/src/js/dashboard.js',
            'custom_dashboard/static/src/js/libs/Chart.bundle.js',
            'custom_dashboard/static/src/xml/dashboard.xml',
            # 'custom_dashboard/static/src/csee/custom_css.css',
        ],
    },

    'installable': True,
    'auto_install': False,
    'application': True,
    }
