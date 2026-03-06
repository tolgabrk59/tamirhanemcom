const axios = require('axios');

// NetGSM Configuration
const config = {
  usercode: '2826060382',
  password: '4#8864A',
  header: 'T.KUTLUER',
  otpUrl: 'https://api.netgsm.com.tr/sms/send/otp',
};

// Test phone number - CHANGE THIS TO YOUR PHONE NUMBER
const testPhone = '905446207275';
const testOTP = '123456';

function getNetGSMErrorMessage(code) {
  const errorMessages = {
    '20': 'Mesaj metni boş veya geçersiz',
    '30': 'Geçersiz kullanıcı adı, şifre veya API erişim izni yok',
    '40': 'Mesaj başlığı (msgheader) tanımsız veya hatalı',
    '50': 'Abone hesabınızda OTP paketi tanımlı değil',
    '51': 'Yetersiz OTP kredisi',
    '70': 'Geçersiz veya hatalı parametre',
    '80': 'Gönderim sınırı aşıldı',
    '85': 'Mükerrer gönderim (aynı numara/mesaj kısa sürede)',
  };
  return errorMessages[code] || `NetGSM hata kodu: ${code}`;
}

async function testNetGSMOTP() {
  console.log('='.repeat(60));
  console.log('NetGSM OTP API Test');
  console.log('='.repeat(60));
  console.log('');
  console.log('Config:');
  console.log('  Usercode:', config.usercode);
  console.log('  Password:', config.password);
  console.log('  Header:', config.header);
  console.log('  OTP URL:', config.otpUrl);
  console.log('');
  console.log('Test Data:');
  console.log('  Phone:', testPhone);
  console.log('  OTP Code:', testOTP);
  console.log('');

  try {
    // Build message (no Turkish characters for OTP)
    const message = `Tamirhanem dogrulama kodunuz: ${testOTP}`;

    // Build URL with query parameters
    const params = new URLSearchParams({
      usercode: config.usercode,
      password: config.password,
      msgheader: config.header,
      msg: message,
      no: testPhone,
    });

    const url = `${config.otpUrl}?${params.toString()}`;

    console.log('Request URL (password hidden):');
    console.log('  ', url.replace(config.password, '***'));
    console.log('');
    console.log('Sending request...');
    console.log('');

    const response = await axios.get(url, {
      timeout: 30000,
    });

    const responseText = String(response.data).trim();

    console.log('Response:');
    console.log('  Raw:', responseText);
    console.log('');

    // Parse response
    if (responseText.startsWith('00')) {
      const parts = responseText.split(' ');
      const messageId = parts[1] || 'unknown';

      console.log('✅ SUCCESS!');
      console.log('  Message ID:', messageId);
      console.log('  SMS should arrive shortly to', testPhone);
    } else {
      const errorCode = responseText;
      const errorMessage = getNetGSMErrorMessage(errorCode);

      console.log('❌ FAILED!');
      console.log('  Error Code:', errorCode);
      console.log('  Error Message:', errorMessage);
    }

  } catch (error) {
    console.log('❌ REQUEST FAILED!');
    console.log('  Error:', error.message);
    if (error.response) {
      console.log('  Status:', error.response.status);
      console.log('  Data:', error.response.data);
    }
  }

  console.log('');
  console.log('='.repeat(60));
}

testNetGSMOTP();
