
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset all error messages
    document.querySelectorAll('.error').forEach(error => error.style.display = 'none');
    
    let isValid = true;
    
    // Registration Number validation
    const regNo = document.getElementById('regNo').value;
    if (!regNo) {
        document.getElementById('regNoError').style.display = 'block';
        isValid = false;
    }
    
    // Name validation
    const name = document.getElementById('name').value;
    if (!name) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }
    
    // Year validation
    const year = document.getElementById('year').value;
    if (!year || year < 1 || year > 4) {
        document.getElementById('yearError').style.display = 'block';
        isValid = false;
    }
    
    // Email validation
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }
    
    // Password validation
    const password = document.getElementById('password').value;
    if (password.length < 6) {
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        // Here you would typically send the data to your server
        console.log('Form submitted successfully:', {
            regNo,
            name,
            year,
            email,
            password
        });
        alert('Sign up successful!');
        this.reset();
    }
});
