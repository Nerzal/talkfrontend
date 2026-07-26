
userInput := input.New(input.TextInput).
SetAutofocus(true).
SetId("username").
SetName("username").
SetAttribute("placeholder", "Username")

passwordInput := input.New(input.PasswordInput).
SetId("password").
SetName("password").
SetAttribute("placeholder", "Password")

submitContainer := doc.CreateElement("div").
SetId("submit-container").
SetClass("submit-container")

loginButton := doc.
CreateElement("button").
SetAttribute("type", "button").
SetInnerHTML("Sign In").
AddEventListener("click", js.FuncOf(s.onLogin))