function validateForm() {
  let x = document.forms["myForm"]["username"].value;
  let y = document.forms["myForm"]["password"].value;
  if (x == "" || y == "") {
    alert("All text fields must be filled out");
    return false;
  }
}