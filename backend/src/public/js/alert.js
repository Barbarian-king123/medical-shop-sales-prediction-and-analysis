// window.onload = function () {
//     const params = new URLSearchParams(window.location.search);

//     const error = params.get("error");
//     const success = params.get("success");

//     if (error) {
//         alert(error);
//     }

//     if (success) {
//         alert(success);
//     }
// };

window.onload = function () {
    const params = new URLSearchParams(window.location.search);

    const error = params.get("error");
    const success = params.get("success");

    if (error) {
        alert(error);
    }

    if (success) {
        alert(success);
    }

    // ✅ Remove query parameters after showing alert
    if (error || success) {
        const cleanUrl = window.location.protocol + "//" + 
                         window.location.host + 
                         window.location.pathname;

        window.history.replaceState({}, document.title, cleanUrl);
    }
};