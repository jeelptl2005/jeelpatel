from flask import Flask, render_template, redirect, request, url_for, flash,send_from_directory
import smtplib as s
import os

app= Flask(__name__)
app.secret_key="jeel1101"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/submit",methods= ["GET","POST"])
def submit():
    if request.method=="POST":
        name= request.form.get("name")
        email= request.form.get("email")
        message= request.form.get("message")

        subject1= "New response"
        subject2= "Thank you for contacting Jeel Patel!"
        body1= f"""Subject: {subject1}\n\nYou received a new response from you Portfolio.\n\nName: {name}\nEmail: {email}\nMessage: {message}"""
        body2= f"""Subject: {subject2}\n\nDear {name},\n\nThank you for reaching out through my portfolio website!\n\nI have received your message and will get back as soon as possible.\n\nBest regards,\nJEEL PATEL.\nFull-Stack Developer."""

        FROM= "jeelptl2005@gmail.com"
        PASSWORD= "xnnp tdpt gdqu rutn"

        try:
            with s.SMTP("smtp.gmail.com",587) as server:
                server.starttls()
                server.login(FROM,PASSWORD)
                server.sendmail(FROM,email,body2)
                server.sendmail(email, FROM, body1)
            flash("Message sent successfully","success")
            return redirect(url_for("home"))
        except:
            flash("Error to sending your message. Try again later.")
            return redirect(url_for("home"))
    return redirect(url_for("home"))

@app.route('/sitemap.xml', methods=['GET'])
def sitemap():
    return send_from_directory('.', 'sitemap.xml', mimetype='application/xml')

port = int(os.environ.get("PORT", 8080))
app.run(debug=True,host="0.0.0.0", port=port)



