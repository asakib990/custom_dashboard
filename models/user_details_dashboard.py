from odoo import models, fields, api, _
from odoo.http import request
import logging
import base64

class UserDetailsDashboard(models.Model):
    _inherit = "res.partner"
    
    @api.model
    def get_user_details(self):
        uid = request.session.uid
        user = self.env['res.users'].sudo().search([('id','=',uid)], limit=1)
        partner = user.partner_id
        info_list = []
        for info in partner:
            info_list.append({
                'name': info.name,
                'image': info.image_1920,
                'email': info.email,
            })
                
        
        logging.info("-----------------------")
        logging.info("user details: %r", user)
        logging.info("-----------------------")
        logging.info("-----------------------")
        logging.info("user details: %r", info_list)
        # logging.info("user details: %r", type(info_list[0]['image']))
        logging.info("-----------------------")
        
        return info_list