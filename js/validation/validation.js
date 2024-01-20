function isValidEmail(email) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidName(name) {
    const nameRegex = /^[A-Za-z\s\-_@#$%^&*()+=<>?/\\{}[\]|\,.:;'"`!]{2}$/;
    return nameRegex.test(name);
}
function isValidPlan(name) {
    const nameRegex = /^[A-Za-z0-9\s\-_@#$%^&*()+=<>?/\\{}[\]|\,.:;'"`!]{2,50}$/;
    return nameRegex.test(name);
}
function isValidPassword(name) {
    const passwordRegex = /^.{6,20}$/;

    return passwordRegex.test(name)
}