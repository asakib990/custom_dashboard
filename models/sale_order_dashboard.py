from odoo import _, api, fields, models

class SaleOrderDashboard(models.Model):
    _name = 'sale.order.dashboard'
    
    @api.model
    def _get_default_application_data(self):
        total_sale_order = self.env['sale.order'].search([])
        # total_sessions = self.env['se.admission.session'].search([])
     
    
    @api.model
    def get_sale_order_count(self):
        orders = self.env['sale.order'].search([])
        counts = {}
        
        for order in orders:
            name = order.partner_id.name
            if name not in counts:
                counts[name] = 1
            else: 
                counts[name] += 1
                
        data = []
        colors = [
            'rgba(94, 133, 225, 1)',
        ]
        bg_colors = ['rgba(250, 234, 242, 0.07)']
        color_index = 0
        
        for name, count in counts.items():
            data.append({
                'label': name,
                'value': count,
                'color': colors,
                'bg_colors': bg_colors,
            })
            color_index = (color_index + 1) % len(colors)
        
        return data