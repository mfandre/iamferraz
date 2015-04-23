module.exports = function(app) {
	var multiparty = require('multiparty');
	var fs = require('fs');
	var UploadController = {
		upload: function(req, res) {
			console.log('-------------------upload');
			console.log(req.query);
			var form = new multiparty.Form();

			form.parse(req, function(err, fields, files) {
				console.log(JSON.stringify(fields));
				console.log(JSON.stringify(files));

				for(var i = 0 ; i < files.upload.length; i++){
					var tmpPath = files.upload[i].path;
					var originalName = files.upload[i].originalFilename;

					var dest = __dirname + "/../public/uploads/" + originalName;

					fs.readFile(tmpPath, function(err, data) {
						if (err) {
							console.log(err);
							return;
						}

						fs.writeFile(dest, data, function(err) {
							if (err) {
								console.log(err);
								return;
							}

							var html = "";
							html += "<script type='text/javascript'>";
							html += " var funcNum = " + req.query.CKEditorFuncNum + ";";
							html += " var url = \"public/uploads/" + originalName + "\";";
							html += " var message = \"Uploaded file successfully\";";
							html += "";
							html += " window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
							html += "</script>";

							res.send(html);
						});
					});
				}
			});
		}
	};

	return UploadController;
}