from flask import Flask
import Server.database as database

app = Flask(__name__, static_folder="static", static_url_path="")
app.debug = True

if __name__ == '__main__':
	app.run(debug=True)