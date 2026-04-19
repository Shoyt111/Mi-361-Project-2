function createAccount(email, pass)
{
    const form = new FormData();
    form.append("email", email);
    form.append("pass", pass);

    fetch("/create_acc", {method : "POST", body: form})
    .then (r => r.json())
    .then(data => {
        {
            if(data['status'] > 1)
            {
                window.location.href = "/incorrect_combination"
            }
            else{
                window.location.href = "/"
}
        }
    });
}

function login(email, pass)
{
    const form = new FormData();
    form.append("email", email);
    form.append("pass", pass);

    fetch("/login", {method : "POST", body: form})
    .then (r => r.json())
    .then(data => {
        {
            if(data['status'] == 1)
            {
                window.location.href = "/picture_page";
                localStorage.setItem("token", data.token)
            }
            else
            {
                window.location.href = "/incorrect_combination"
            }
        }
    });

}
function onSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    fetch("/google_login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: id_token })
    })
    .then(r => r.json())
    .then(data => {
        if (data.status === 1) {
            localStorage.setItem("token", data.token);
            window.location.href = "/picture_page";
        } else {
            alert("Google login failed");
        }
    });
}
function handleCredentialResponse(response) {
    const id_token = response.credential;

    fetch("/google_login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: id_token })
    })
    .then(r => r.json())
    .then(data => {
        console.log(data); // <-- ADD THIS

        if (data.status === 1) {
            localStorage.setItem("token", data.token);
            window.location.href = "/picture_page";
        } else {
            alert("Login failed");
        }
    })
    .catch(err => console.error(err));
}