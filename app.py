from flask import Flask, render_template, request, jsonify, make_response
import sqlite3
import os
import hashlib
import datetime
import jwt
from jwt import InvalidSignatureError

app = Flask(__name__)
db_name = "jbbns.db"
sql_file = "jbbns.sql"
db_flag = False
SECRET = "asdsaas11sadasd111hghg11zxc33333rthr1312dxc"

def get_db():
    conn = sqlite3.connect(db_name)
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

@app.route("/")
def index():
    return render_template("login.html")

@app.route("/create_acc", methods = ["POST"])
def create_acc():
    email = request.form["email"]
    password = request.form["pass"]
    
    conn = get_db()
    cursor = conn.cursor()
    
    h = hashlib.sha256((password).encode("utf-8")).hexdigest()
    
    cursor.execute("SELECT count(*) FROM Users WHERE email == ?", (email,))
    num_of_users = (cursor.fetchall())[0][0]

    status = 1
    if num_of_users > 0:
        status = 3
    
    # Temporarily commented out since we're using google and salt hashing would be kind of annoying to do right now
    # cursor.execute("SELECT count(*) FROM Users WHERE hashed_password == ?", (h,))
    # num_of_hashes = (cursor.fetchall())[0][0]
    
    # if num_of_hashes > 0:
    #     status = 2
        
    if status == 1:
        cursor.execute("INSERT INTO Users VALUES (?,?);", (email, h))
        
    conn.commit()
    conn.close()
    return jsonify({"status" : status})

@app.route("/login", methods = ["POST"])
def login():
    email = request.form["email"]
    password = request.form["pass"]
    
    h = hashlib.sha256((password).encode("utf-8")).hexdigest()
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT count(*) FROM Users WHERE email == ? AND hashed_password == ?", (email, h,))
    results = cursor.fetchall()
    correct = results[0][0]
    
    payload = {"email" : email}
    token = jwt.encode(payload, SECRET, algorithm = "HS256")        
    
    if correct:
        return jsonify({"status" : 1, "token" : token})
    return jsonify({"status" : 2, "token" : "NULL"})

@app.route("/picture_page", methods = ["GET", "POST"])
def picture_page():
    return render_template("index.html")

@app.route("/incorrect_combination", methods = ["GET", "POST"])
def incorrect_combination():
    return render_template("incorrect.html")

# sen
@app.route("/login_page", methods = ["GET"])
def login_page():
    return render_template("login.html")

@app.route("/upload", methods = ["POST"])
def upload():
        
    conn = get_db()
    cursor = conn.cursor()
    try:
        picture = request.files["picture"]
        token = request.headers["Authorization"]
        
        try:
            plain = jwt.decode(token, SECRET, algorithms = ["HS256"])
        except:
            return jsonify({"status" : 2})
        
        name, ext = os.path.splitext(picture.filename)
        test_dir = "static/uploads/" + name + ext
        i = 0
        while os.path.exists(test_dir):
            i += 1
            test_dir = "static/uploads/" + name + str(i) + ext
            
        cursor.execute("INSERT INTO Pictures VALUES (?,?)", (test_dir, plain['email']),)
        picture.save(test_dir)
        
        conn.commit()
        conn.close()
        return jsonify({"status" : 1})
    except:
        conn.commit()
        conn.close()
        return jsonify({"status" : 2})
        
        


@app.route("/decode_token", methods = ["POST"])
def decode_token():
    token = request.form["token"]
    plain = jwt.decode(token, SECRET, algorithms = ["HS256"])
    
    return jsonify({"status" : 1, "email" : plain["email"]})

@app.route("/get_user_images", methods = ["POST"])
def get_user_images():
    token = request.form["token"]
    plain = jwt.decode(token, SECRET, algorithms = ["HS256"])
    user = plain['email']
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT file_name FROM Pictures WHERE email == ?", (user,))
    results = cursor.fetchall()
    file_list = []
    for row in results:
        file_name = row[0]
        file_list.append(file_name)
        
    print(file_list)
    return jsonify({"status" : 1, "photos" : file_list})
