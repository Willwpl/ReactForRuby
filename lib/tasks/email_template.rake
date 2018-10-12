namespace :email_template do
  desc "email template init"

  task :init => :environment do
    email_templates = [
        {name: 'REG01: Registration - Retailer registration Submitted to Admin', subject: 'REVV account', body: 'Dear Admin,<br/><br/>#user.company_name has registered for a REVV account. <br/><br/>Please proceed to approve/reject the registration at <a href="http://revv.sg">revv.sg</a>.<br/>', template_type: '1'},
        {name: 'REG03: Registration - Buyer / Retailer registration Approved by Admin', subject: 'REVV account registration has been approved', body: 'Dear #user.company_name,<br/><br/>Congratulations, your REVV account registration has been <b>approved</b>.<br/><br/>You may now log in to your account at <a href="http://revv.sg">revv.sg</a>. <br/>', template_type: '2'},
        {name: 'REG04: Registration - Buyer / Retailer registration Rejected by Admin', subject: 'REVV account registration has been rejected', body: 'Dear #user.company_name,<br/><br/>Your REVV account registration has been <b>rejected</b>.<br/>Comments: #user.comment <br/><br/>Kindly access your account registration page at <a href="http://revv.sg">revv.sg</a> for further actions.', template_type: '3'},
        {name: 'AUC01: Auction - Buyer invitation Sent by Admin', subject: 'You are invited to participate in an upcoming auction', body: 'Dear #buyer.name,<br/><br/>You are invited to participate in an upcoming auction for aggregated electricity purchase. <br/><br/>Please proceed to view and manage your participation at <a href="http://revv.sg">revv.sg</a>. <br/>', template_type: '4'},
        {name: 'AUC05: Auction - Retailer invitation Sent by Admin', subject: 'An auction for aggregated electricity purchase has been published', body: 'Dear #user.company_name,<br/><br/>An auction for aggregated electricity purchase has been published. You are invited to bid in this auction. <br/><br/>Please proceed to view and manage your participation at <a href="http://revv.sg">revv.sg</a>.<br/>', template_type: '5'},
        # {name: 'Retailer Dashboard (submit tender documents)', subject: '#user.company_name has submitted their tender documents', body: 'Dear Admin,<br/><br/>#user.company_name has submitted their tender documents. <br/><br/>Please proceed to approve/reject the tender documents submission at <a href="http://revv.sg">revv.sg</a>.<br/>', template_type: '6'},
        # {name: 'Retailer Dashboard (Admin approve tender document)', subject: 'Your tender documents submission has been approved', body: 'Dear #user.company_name,<br/><br/>Your tender documents submission has been <b>approved</b>.<br/><br/>You may now log in to your account at <a href="http://revv.sg">revv.sg</a> to submit the contact person details for actual day of bidding. <br/>', template_type: '7'},
        # {name: 'Retailer Dashboard (Admin reject tender document)', subject: 'Your tender documents submission has been rejected', body: 'Dear #user.company_name,<br/><br/>Your tender documents submission has been <b>rejected</b>.<br/>Comments: #user.comment <br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> for further actions.<br/>', template_type: '8'},
        {name: 'AUC06: Auction - Retailer deviation request response Sent by Admin', subject:'Admin has responded to your deviation request.', body:'Dear #user.company_name,<br/><br/>Admin has responded to your deviation request.<br/><br/>Please proceed to view the response and manage deviation request at <a href="http://revv.sg">revv.sg</a>.', template_type: '9'},
        {name: 'AUC07: Auction - Retailer won bid Sent by Admin', subject:'Auction winner confirmation', body:'Dear #retailer_company_name,<br/><br/>Congratulations, #retailer_company_name has been awarded the tender for #months electricity purchase category under the reverse auction conducted on #date_of_ra (ID: #ra_id).<br/><br/>Please proceed to acknowledge the Letter(s) of Award at <a href="http://revv.sg">revv.sg</a>.', template_type: '10'},
        {name: 'REG02: Registration - Buyer registration Submitted to Admin', subject:'Buyer registration', body:'Dear Admin,<br/><br/>#buyer_company_name has registered for a REVV account.<br/><br/>Please proceed to manage the registration at <a href="http://revv.sg">revv.sg</a>.', template_type: '11'},
        {name: "TEN01: Tenant - Buyer's tenant details Uploaded by Admin", subject:'CSV and PDF files upload', body:'Dear #buyer_company_name,<br/><br/>Admin has uploaded the (i) tenant account details and (ii) Master - Tenant Agreement. <br/><br/>Please proceed to accept/reject at <a href="http://revv.sg">revv.sg</a>.', template_type: '12'},
        {name: "TEN02: Tenant - Buyer's acceptance of tenant details Submitted to Admin", subject:'Accept CSV and PDF files', body:'Dear Admin,<br/><br/>#buyer_company_name has accepted your tenant file uploads.<br/><br/>Comments: #comments<br/><br/>Please proceed to manage the registration at <a href="http://revv.sg">revv.sg</a>.', template_type: '13'},
        {name: "TEN03: Tenant - Buyer's rejection of tenant details Submitted to Admin", subject:'Reject CSV and PDF files', body:'Dear Admin,<br/><br/>#buyer_company_name has rejected your tenant file uploads.<br/><br/>Comments: #comments<br/><br/>Please proceed to manage the registration at <a href="http://revv.sg">revv.sg</a>.', template_type: '14'},
        {name: 'TEN04: Tenant - Tenant account creation Sent by Admin', subject:'Tenant account creation', body:'Dear #tenant_company_name,<br/><br/>A REVV account has been created for you by #buyer_company_name for electricity bill management.<br/><br/>REVV account log-in details:<br/>Email: #tenant_email<br/>Default Password: #password<br/><br/>You may now log in to your account and proceed to change your default passport at <a href="http://revv.sg">revv.sg</a>.', template_type: '15'},
        {name: 'TEN05: Tenant - Buyer change tenant details (for approval) Submitted to Admin', subject:'Buyer change tenant information(1)', body:'Dear Admin,<br/><br/>#buyer_company_name has raised a change request in the tenant details.<br/><br/>Please proceed to approve/reject the change request at <a href="http://revv.sg">revv.sg</a>.', template_type: '16'},
        {name: 'TEN06: Tenant - Buyer change tenant details (for info) Submitted to Admin', subject:'Buyer change tenant information(2)', body:'Dear Admin,<br/><br/>#buyer_company_name has made amendments to the following fields for tenant: #tenant_name<br/>- #field_1<br/>- #field_2<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details.', template_type: '17'},
        {name: 'TEN07: Tenant - Buyer change tenant details (for info) Submitted to Tenant', subject:'Buyer change tenant information(3)', body:'Dear #tenant_company_name],<br/><br/>#buyer_company_name has made amendments to the following fields for tenant: #tenant_name<br/>- #field_1<br/>- #field_2<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details.', template_type: '18'},
        {name: 'TEN08: Tenant - Buyer change tenant details Approved by Admin', subject:'Admin approve tenant information change', body:'Dear #buyer_company_name],<br/><br/>Your tenant details change request has been approved.<br/><br/>Comments: #comments<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details.', template_type: '19'},
        {name: 'TEN09: Tenant - Buyer change tenant details Rejected by Admin', subject:'Admin reject tenant information change', body:'Dear #buyer_company name,<br/><br/>Your tenant details change request has been rejected.<br/><br/>Comments: #comments<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> for further actions.', template_type: '20'},
        {name: 'TEN10: Tenant - Tenant change tenant details (for info) Submitted to Admin', subject:'Tenant change', body:'Dear Admin,<br/><br/>#tenant_company_name has made amendments to the following fields:<br/>- #field_1<br/>- #field_2<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details. ', template_type: '21'},
        {name: 'TEN11: Tenant - Tenant change tenant details (for info) Submitted to Buyer', subject:'Tenant change', body:'Dear #buyer_company_name,<br/><br/>#tenant_company_name has made amendments to the following fields:<br/>- #field_1<br/>- #field_2<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details. ', template_type: '22'},
        {name: "TEN12: Tenant - Buyer's new tenant accounts Uploaded by Admin", subject:'Admin add new tenant accounts', body:'Dear #buyer_company_name,<br/><br/>Admin has added new tenant accounts. <br/><br/>Please proceed to accept/reject the new tenant accounts at <a href="http://revv.sg">revv.sg</a>.', template_type: '23'},
        {name: "TEN12: Tenant - Buyer's acceptance of new tenant accounts Submitted to Admin", subject:'Buyer accept new added tenant accounts', body:'Dear Admin,<br/><br/>#buyer_company_name has accepted the new tenant account details.<br/><br/>Comments: #comments<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> to view the updated tenant details.', template_type: '24'},
        {name: "TEN13: Tenant - Buyer's rejection of new tenant accounts Submitted to Admin", subject:'Buyer reject new added tenant accounts', body:'Dear Admin,<br/><br/>#buyer_company_name has rejected the new tenant account details.<br/><br/>Comments: #comments<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> for further actions.', template_type: '25'},
        {name: "AUC02: Auction - Buyer participation Submitted to Admin", subject:"Buyer click 'Participate'", body:'Dear Admin,<br/><br/>#buyer_company_name has submitted purchase details for participation in an upcoming auction: #name_of_ra on #date_time.<br/><br/>Please proceed to approve/reject the submission at <a href="http://revv.sg">revv.sg</a>', template_type: '26'},
        {name: "AUC03: Auction - Buyer participation Approved by Admin", subject:"#name_of_ra on #date_time has been approved", body:'Dear #buyer_company_name,<br/><br/>Your purchase details for participation in the upcoming auction (#name_of_ra on #date_time) has been approved.<br/><br/>You may view your approved participation details at <a href="http://revv.sg">revv.sg</a>.', template_type: '27'},
        {name: "AUC04: Auction - Buyer participation Rejected by Admin", subject:"#name_of_ra on #date_time has been rejected", body:'Dear #buyer_company_name,<br/><br/>Your purchase details for participation in the upcoming auction (#name_of_ra on #date_time) has been rejected.<br/><br/>Please log in to your account at <a href="http://revv.sg">revv.sg</a> for further actions.', template_type: '28'},

    ]

    email_templates.each do |template|
      EmailTemplate.find_or_create_by(template_type: template[:template_type]) do |this_template|
        this_template.name = template[:name]
        this_template.subject = template[:subject]
        this_template.body = template[:body]
        this_template.template_type = template[:template_type]
      end
    end
  end

  task :delete => [:environment] do
    EmailTemplate.delete_all
  end

  task :reset => [:delete, :init]
end
