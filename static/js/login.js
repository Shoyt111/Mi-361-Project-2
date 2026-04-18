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