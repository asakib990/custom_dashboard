from odoo import models, fields, api, _
from odoo.http import request
import logging
import base64

class ProjectTaskDashboard(models.Model):
    _inherit = "project.task"
    
    @api.model
    def get_project_details(self):
        uid = request.session.uid
        user = self.env['res.users'].sudo().search([('id','=',uid)], limit=1)
        task_list = self.env['project.task'].sudo().search([
            ('user_ids','=',user.ids)
        ])
        info_list = []
        for task in task_list:
            info_list.append({
                'name': task.name,
                'progress': task.progress,
            })
            logging.info("===========TASK============")
            logging.info("task: %r", task)    
            logging.info("task.project_id.name: %r", task.project_id.name)    
            logging.info("task.progress: %r", task.progress)    
            logging.info("info_list: %r", info_list)    
            logging.info("info_list[0]: %r", info_list[0])    
        
            
        return info_list
        