<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Group Invitation - Bill Splitter</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .group-info {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .group-name {
            font-size: 20px;
            font-weight: 600;
            color: #1a202c;
            margin: 0 0 10px 0;
        }
        .group-description {
            color: #4a5568;
            margin: 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }
        .logo {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        .features {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            text-align: center;
        }
        .feature {
            flex: 1;
            padding: 0 15px;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .feature-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: #2d3748;
        }
        .feature-desc {
            font-size: 14px;
            color: #718096;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 8px;
            }
            .header, .content, .footer {
                padding: 20px;
            }
            .features {
                flex-direction: column;
            }
            .feature {
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">💰 Bill Splitter</div>
            <h1>You're Invited!</h1>
            <p>Join a group to start splitting expenses with friends and family</p>
        </div>
        
        <div class="content">
            <p>Hello!</p>
            
            <p>You've been invited to join a group on <strong>Bill Splitter</strong> - the easiest way to manage shared expenses with friends, family, or roommates.</p>
            
            <div class="group-info">
                <div class="group-name">📋 {{ $groupName }}</div>
                @if(isset($groupDescription) && $groupDescription)
                    <p class="group-description">{{ $groupDescription }}</p>
                @endif
            </div>
            
            <p>By joining this group, you'll be able to:</p>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">💸</div>
                    <div class="feature-title">Split Expenses</div>
                    <div class="feature-desc">Easily divide bills and track who owes what</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">Track Balances</div>
                    <div class="feature-desc">See your current balance and settlement status</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔔</div>
                    <div class="feature-title">Get Notifications</div>
                    <div class="feature-desc">Stay updated on new expenses and settlements</div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ $inviteLink }}" class="cta-button">
                    Accept Invitation
                </a>
            </div>
            
            <p style="font-size: 14px; color: #718096; text-align: center;">
                This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
            </p>
        </div>
        
        <div class="footer">
            <p><strong>Bill Splitter</strong> - Making expense sharing simple and fair</p>
            <p>If you have any questions, please contact the person who invited you.</p>
        </div>
    </div>
</body>
</html>