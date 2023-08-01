import nodemailer from "nodemailer"
import dotenv from "dotenv"


dotenv.config({ path: "config.env" })

//For sending the email
async function sendConfirmationMail(data) {

    try {
        const { email, subject, userName, hotel, checkIn, checkOut, hotelLocation, amount, method } = data
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: `<!DOCTYPE html
            PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
            style="font-family:Montserrat, sans-serif">
        
        <head>
            <meta charset="UTF-8">
            <meta content="width=device-width, initial-scale=1" name="viewport">
            <meta name="x-apple-disable-message-reformatting">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta content="telephone=no" name="format-detection">
            <title>New email template 2023-07-31</title><!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
        <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]--><!--[if !mso]><!-- -->
            <link href="https://fonts.googleapis.com/css2?family=Krona+One&display=swap" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"><!--<![endif]-->
            <style type="text/css">
                .rollover div {
                    font-size: 0;
                }
        
                #outlook a {
                    padding: 0;
                }
        
                .es-button {
                    mso-style-priority: 100 !important;
                    text-decoration: none !important;
                }
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: none !important;
                    font-size: inherit !important;
                    font-family: inherit !important;
                    font-weight: inherit !important;
                    line-height: inherit !important;
                }
        
                .es-desk-hidden {
                    display: none;
                    float: left;
                    overflow: hidden;
                    width: 0;
                    max-height: 0;
                    line-height: 0;
                    mso-hide: all;
                }
        
                @media only screen and (max-width:600px) {
        
                    p,
                    ul li,
                    ol li,
                    a {
                        line-height: 150% !important
                    }
        
                    h1,
                    h2,
                    h3,
                    h1 a,
                    h2 a,
                    h3 a {
                        line-height: 120%
                    }
        
                    h1 {
                        font-size: 30px !important;
                        text-align: center
                    }
        
                    h2 {
                        font-size: 26px !important;
                        text-align: center
                    }
        
                    h3 {
                        font-size: 20px !important;
                        text-align: center
                    }
        
                    .es-header-body h1 a,
                    .es-content-body h1 a,
                    .es-footer-body h1 a {
                        font-size: 30px !important
                    }
        
                    .es-header-body h2 a,
                    .es-content-body h2 a,
                    .es-footer-body h2 a {
                        font-size: 26px !important
                    }
        
                    .es-header-body h3 a,
                    .es-content-body h3 a,
                    .es-footer-body h3 a {
                        font-size: 20px !important
                    }
        
                    .es-menu td a {
                        font-size: 12px !important
                    }
        
                    .es-header-body p,
                    .es-header-body ul li,
                    .es-header-body ol li,
                    .es-header-body a {
                        font-size: 12px !important
                    }
        
                    .es-content-body p,
                    .es-content-body ul li,
                    .es-content-body ol li,
                    .es-content-body a {
                        font-size: 14px !important
                    }
        
                    .es-footer-body p,
                    .es-footer-body ul li,
                    .es-footer-body ol li,
                    .es-footer-body a {
                        font-size: 12px !important
                    }
        
                    .es-infoblock p,
                    .es-infoblock ul li,
                    .es-infoblock ol li,
                    .es-infoblock a {
                        font-size: 12px !important
                    }
        
                    *[class="gmail-fix"] {
                        display: none !important
                    }
        
                    .es-m-txt-c,
                    .es-m-txt-c h1,
                    .es-m-txt-c h2,
                    .es-m-txt-c h3 {
                        text-align: center !important
                    }
        
                    .es-m-txt-r,
                    .es-m-txt-r h1,
                    .es-m-txt-r h2,
                    .es-m-txt-r h3 {
                        text-align: right !important
                    }
        
                    .es-m-txt-l,
                    .es-m-txt-l h1,
                    .es-m-txt-l h2,
                    .es-m-txt-l h3 {
                        text-align: left !important
                    }
        
                    .es-m-txt-r img,
                    .es-m-txt-c img,
                    .es-m-txt-l img {
                        display: inline !important
                    }
        
                    .es-button-border {
                        display: inline-block !important
                    }
        
                    a.es-button,
                    button.es-button {
                        font-size: 20px !important;
                        display: inline-block !important
                    }
        
                    .es-adaptive table,
                    .es-left,
                    .es-right {
                        width: 100% !important
                    }
        
                    .es-content table,
                    .es-header table,
                    .es-footer table,
                    .es-content,
                    .es-footer,
                    .es-header {
                        width: 100% !important;
                        max-width: 600px !important
                    }
        
                    .es-adapt-td {
                        display: block !important;
                        width: 100% !important
                    }
        
                    .adapt-img {
                        width: 100% !important;
                        height: auto !important
                    }
        
                    .es-m-p0 {
                        padding: 0 !important
                    }
        
                    .es-m-p0r {
                        padding-right: 0 !important
                    }
        
                    .es-m-p0l {
                        padding-left: 0 !important
                    }
        
                    .es-m-p0t {
                        padding-top: 0 !important
                    }
        
                    .es-m-p0b {
                        padding-bottom: 0 !important
                    }
        
                    .es-m-p20b {
                        padding-bottom: 20px !important
                    }
        
                    .es-mobile-hidden,
                    .es-hidden {
                        display: none !important
                    }
        
                    tr.es-desk-hidden,
                    td.es-desk-hidden,
                    table.es-desk-hidden {
                        width: auto !important;
                        overflow: visible !important;
                        float: none !important;
                        max-height: inherit !important;
                        line-height: inherit !important
                    }
        
                    tr.es-desk-hidden {
                        display: table-row !important
                    }
        
                    table.es-desk-hidden {
                        display: table !important
                    }
        
                    td.es-desk-menu-hidden {
                        display: table-cell !important
                    }
        
                    .es-menu td {
                        width: 1% !important
                    }
        
                    table.es-table-not-adapt,
                    .esd-block-html table {
                        width: auto !important
                    }
        
                    table.es-social {
                        display: inline-block !important
                    }
        
                    table.es-social td {
                        display: inline-block !important
                    }
        
                    .es-m-p5 {
                        padding: 5px !important
                    }
        
                    .es-m-p5t {
                        padding-top: 5px !important
                    }
        
                    .es-m-p5b {
                        padding-bottom: 5px !important
                    }
        
                    .es-m-p5r {
                        padding-right: 5px !important
                    }
        
                    .es-m-p5l {
                        padding-left: 5px !important
                    }
        
                    .es-m-p10 {
                        padding: 10px !important
                    }
        
                    .es-m-p10t {
                        padding-top: 10px !important
                    }
        
                    .es-m-p10b {
                        padding-bottom: 10px !important
                    }
        
                    .es-m-p10r {
                        padding-right: 10px !important
                    }
        
                    .es-m-p10l {
                        padding-left: 10px !important
                    }
        
                    .es-m-p15 {
                        padding: 15px !important
                    }
        
                    .es-m-p15t {
                        padding-top: 15px !important
                    }
        
                    .es-m-p15b {
                        padding-bottom: 15px !important
                    }
        
                    .es-m-p15r {
                        padding-right: 15px !important
                    }
        
                    .es-m-p15l {
                        padding-left: 15px !important
                    }
        
                    .es-m-p20 {
                        padding: 20px !important
                    }
        
                    .es-m-p20t {
                        padding-top: 20px !important
                    }
        
                    .es-m-p20r {
                        padding-right: 20px !important
                    }
        
                    .es-m-p20l {
                        padding-left: 20px !important
                    }
        
                    .es-m-p25 {
                        padding: 25px !important
                    }
        
                    .es-m-p25t {
                        padding-top: 25px !important
                    }
        
                    .es-m-p25b {
                        padding-bottom: 25px !important
                    }
        
                    .es-m-p25r {
                        padding-right: 25px !important
                    }
        
                    .es-m-p25l {
                        padding-left: 25px !important
                    }
        
                    .es-m-p30 {
                        padding: 30px !important
                    }
        
                    .es-m-p30t {
                        padding-top: 30px !important
                    }
        
                    .es-m-p30b {
                        padding-bottom: 30px !important
                    }
        
                    .es-m-p30r {
                        padding-right: 30px !important
                    }
        
                    .es-m-p30l {
                        padding-left: 30px !important
                    }
        
                    .es-m-p35 {
                        padding: 35px !important
                    }
        
                    .es-m-p35t {
                        padding-top: 35px !important
                    }
        
                    .es-m-p35b {
                        padding-bottom: 35px !important
                    }
        
                    .es-m-p35r {
                        padding-right: 35px !important
                    }
        
                    .es-m-p35l {
                        padding-left: 35px !important
                    }
        
                    .es-m-p40 {
                        padding: 40px !important
                    }
        
                    .es-m-p40t {
                        padding-top: 40px !important
                    }
        
                    .es-m-p40b {
                        padding-bottom: 40px !important
                    }
        
                    .es-m-p40r {
                        padding-right: 40px !important
                    }
        
                    .es-m-p40l {
                        padding-left: 40px !important
                    }
        
                    .es-desk-hidden {
                        display: table-row !important;
                        width: auto !important;
                        overflow: visible !important;
                        max-height: inherit !important
                    }
                }
            </style>
        </head>
        
        <body
            style="width:100%;font-family:Montserrat, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
            <div class="es-wrapper-color" style="background-color:#0D2225"><!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
        <v:fill type="tile" color="#0d2225"></v:fill>
        </v:background>
        <![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#0D2225">
                    <tr>
                        <td valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-header" align="center"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table bgcolor="#0f1011" class="es-header-body" align="center" cellpadding="0"
                                            cellspacing="0"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#0f1011;width:600px">
                                            <tr>
                                                <td align="left"
                                                    style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:30px">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr class="es-visible-simple-html-only">
                                                            <td class="es-m-p0r es-container-visible-simple-html-only"
                                                                valign="top" align="center"
                                                                style="padding:0;Margin:0;width:560px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;font-size:0px"><a
                                                                                target="_blank" href="https://localhost:8000"
                                                                                style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#FFFFFF;font-size:14px"><img
                                                                                    class="adapt-img"
                                                                                    src="https://slxlia.stripocdn.email/content/guids/CABINET_2e79c273a96bb056b73cae7b029b803ad629a2aedf350efa42ca348fe2403c2c/images/stayscoutlowresolutionlogowhiteontransparentbackground_1.png"
                                                                                    alt
                                                                                    style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                                                                    width="380"></a></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-content" align="center"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table bgcolor="#0f1011" class="es-content-body" align="center" cellpadding="0"
                                            cellspacing="0"
                                            background="https://slxlia.stripocdn.email/content/guids/CABINET_34ad95b423c6803288e09f9a846d2be17a85b2adbe6709a3e7ea35f3ca16bd7d/images/group_sRl.png"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#0F1011;background-repeat:no-repeat;width:600px;background-image:url(https://slxlia.stripocdn.email/content/guids/CABINET_34ad95b423c6803288e09f9a846d2be17a85b2adbe6709a3e7ea35f3ca16bd7d/images/group_sRl.png);background-position:400px 40px">
                                            <tr>
                                                <td align="left"
                                                    style="Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px;padding-top:40px">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="center" valign="top"
                                                                style="padding:0;Margin:0;width:560px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td align="left" class="es-m-txt-l"
                                                                            style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                                                            <h1
                                                                                style="Margin:0;line-height:60px;mso-line-height-rule:exactly;font-family:'Krona One', sans-serif;font-size:40px;font-style:normal;font-weight:bold;color:#FFFFFF">
                                                                                Booking Confirmation</h1>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" class="es-m-txt-l"
                                                                            style="padding:0;Margin:0;padding-bottom:20px">
                                                                            <h3
                                                                                style="Margin:0;line-height:30px;mso-line-height-rule:exactly;font-family:'Krona One', sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#FFFFFF">
                                                                                Hi&nbsp;${userName},</h3>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" style="padding:0;Margin:0">
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">
                                                                                Your stay at ${hotel} has been confirmed</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left" style="padding:20px;Margin:0">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="center" valign="top"
                                                                style="padding:0;Margin:0;width:560px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-left:1px solid #35ccd0;border-right:1px solid #35ccd0;border-top:1px solid #35ccd0;border-bottom:1px solid #35ccd0;border-radius:15px"
                                                                    role="presentation">
                                                                    <tr>
                                                                        <td align="left" class="es-m-txt-l"
                                                                            style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                                                                            <h3
                                                                                style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:'Krona One', sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#FFFFFF">
                                                                                The details</h3>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;font-size:0">
                                                                            <table border="0" width="100%" height="100%"
                                                                                cellpadding="0" cellspacing="0"
                                                                                role="presentation"
                                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                                <tr>
                                                                                    <td
                                                                                        style="padding:0;Margin:0;border-bottom:1px solid #35ccd0;background:unset;height:1px;width:100%;margin:0px">
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" style="padding:20px;Margin:0">
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:24px;color:#FFFFFF;font-size:16px">
                                                                                <strong>checkIn:</strong></p>
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:24px;color:#FFFFFF;font-size:16px">
                                                                                <strong>${checkIn}</strong></p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" style="padding:20px;Margin:0">
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">
                                                                                <strong>checkOut:</strong></p>
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">
                                                                                <strong>${checkOut}</strong></p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" style="padding:20px;Margin:0">
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:24px;color:#FFFFFF;font-size:16px">
                                                                                <strong>Location:</strong></p>
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">
                                                                                ${hotelLocation}</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;font-size:0">
                                                                            <table border="0" width="100%" height="100%"
                                                                                cellpadding="0" cellspacing="0"
                                                                                role="presentation"
                                                                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                                <tr>
                                                                                    <td
                                                                                        style="padding:0;Margin:0;border-bottom:1px solid #35ccd0;background:unset;height:1px;width:100%;margin:0px">
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" style="padding:20px;Margin:0">
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">
                                                                                <strong><span
                                                                                        style="font-size:16px;line-height:24px">Payment
                                                                                        Amount:</span></strong><br>${amount}</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="left" style="padding:20px;Margin:0">
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">
                                                                                <strong><span
                                                                                        style="font-size:16px;line-height:24px">Payment
                                                                                        Method:</span></strong><br>${method}</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-footer" align="center"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                                <tr>
                                    <td align="center" style="padding:0;Margin:0">
                                        <table bgcolor="#0f1011" class="es-footer-body" align="center" cellpadding="0"
                                            cellspacing="0"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#0f1011;width:600px">
                                            <tr>
                                                <td align="left"
                                                    style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="center" valign="top"
                                                                style="padding:0;Margin:0;width:560px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td align="left" style="padding:0;Margin:0">
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">
                                                                                Thank you again for choosing us. We are looking
                                                                                forward to providing you with an exceptional
                                                                                experience during your stay!</p>
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">
                                                                                <br></p>
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:21px;color:#FFFFFF;font-size:14px">
                                                                                If you have any questions or need further
                                                                                assistance, please feel free to contact us .</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="left"
                                                    style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;width:560px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td align="center"
                                                                            style="padding:0;Margin:0;font-size:0px"><img
                                                                                class="adapt-img"
                                                                                src="https://slxlia.stripocdn.email/content/guids/CABINET_2e79c273a96bb056b73cae7b029b803ad629a2aedf350efa42ca348fe2403c2c/images/stayscoutlowresolutionlogowhiteontransparentbackground_1.png"
                                                                                alt
                                                                                style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                                                                width="240"></td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        
        </html>`,
        }
        const result = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}

//  For sending the coupen as a mail
const sendCoupen = async (email, data) => {
    try {
        console.log(data);
        const { subject, discount, coupenCode, expireAt } = data
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Discount Coupon</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f7f7f7;
                    }
            
                    .coupon {
                        width: 350px;
                        padding: 20px;
                        border: 2px solid #ccc;
                        border-radius: 10px;
                        background-color: #fff;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        margin: 50px auto;
                    }
            
                    .coupon h2 {
                        font-size: 28px;
                        margin-bottom: 10px;
                        text-align: center;
                    }
            
                    .coupon p {
                        font-size: 18px;
                        margin-bottom: 20px;
                        text-align: center;
                    }
            
                    .coupon .code {
                        font-size: 26px;
                        font-weight: bold;
                        background-color: #f7f7f7;
                        padding: 5px 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        margin: 0 auto 20px;
                        display: table;
                        color: #007bff;
                    }
            
                    .coupon .valid-until {
                        font-size: 16px;
                        text-align: center;
                    }
            
                    .coupon .cta {
                        display: block;
                        margin: 0 auto;
                        background-color: #007bff;
                        color: #fff;
                        padding: 12px 24px;
                        border: none;
                        border-radius: 5px;
                        font-size: 20px;
                        text-align: center;
                        text-decoration: none;
                        width: 250px;
                        transition: background-color 0.3s ease;
                    }
            
                    .coupon .cta:hover {
                        background-color: #0056b3;
                    }
                </style>
            </head>
            
            <body>
                <div class="coupon">
                    <h2>Discount Coupon</h2>
                    <p>Get <strong>${discount}% off</strong> your next Booking!</p>
                    <div class="code">${coupenCode}</div>
                    <p class="valid-until">Valid until ${expireAt}.</p>
                    <a href="http://localhost:8000" class="cta">Book now</a>
                </div>
            </body>
            
            </html>`,
        }
        const result = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
}


export default {
    sendConfirmationMail,
    sendCoupen,
}