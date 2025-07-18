// A mock function to simulate sending an email with OTP
export async function sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  console.log(`Sending OTP to ${email}...`);

  // In a real application, you would make an API call to your backend here
  // For example:
  // const response = await fetch('https://your-api.com/send-otp', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ email, otp }),
  // });
  // const data = await response.json();
  // return data;

  // Mocking the API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a successful response
      console.log(`OTP ${otp} sent to ${email} successfully.`);
      resolve({ success: true, message: 'OTP sent successfully' });
      
      // To simulate a failure, you could do this:
      // resolve({ success: false, message: 'Failed to send OTP' });
    }, 1000); // Simulate network delay
  });
} 