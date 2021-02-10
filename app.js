API_KEY = "05178919e1mshca5b6d9b53b9541p110a90jsn9b38827e5160"; // API Key of judge0 from https://judge0.com/ce

        var language_to_id = {
            "Bash": 46,
            "C": 50,
            "C#": 51,
            "C++": 54,
            "Java": 62,
            "Python": 71,
            "Ruby": 72
        };

        function encode(str) {
            return btoa(unescape(encodeURIComponent(str || "")));
        }

        function decode(bytes) {
            var escaped = escape(atob(bytes || ""));
            try {
                return decodeURIComponent(escaped);
            } catch {
                return unescape(escaped);
            }
        }

        function errorHandler(jqXHR, textStatus, errorThrown) {
            $("#output").val(`${JSON.stringify(jqXHR, null, 4)}`);
            $("#run").prop("disabled", false);
        }

        function check(token) {
            $("#output").val($("#output").val() + "\nChecking submission status...");
            $.ajax({
                url: `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true`,
                type: "GET",
                headers: {
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
	                "x-rapidapi-key": API_KEY
                },
                success: function (data, textStatus, jqXHR) {
                    if ([1, 2].includes(data["status"]["id"])) {
                        $("#output").val($("#output").val() + "\nStatus: " + data["status"]["description"]);
                        setTimeout(function() { check(token) }, 1000);
                    }
                    else {
                        var output = [decode(data["compile_output"]), decode(data["stdout"])].join("\n").trim();
                        $("#output").val(output);
                        $("#run").prop("disabled", false);
                    }
                },
                error: errorHandler
            });
        }

        function run() {
            $("#run").prop("disabled", true);
            $("#output").val("Creating submission...");
            $.ajax({
                url: "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true",
                type: "POST",
                contentType: "application/json",
                headers: {
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
	                "x-rapidapi-key": API_KEY
                },
                data: JSON.stringify({
                    "language_id": language_to_id[$("#lang").val()],
                    "source_code": encode($("#source").val()),
                    "stdin": encode($("#input").val()),
                    "redirect_stderr_to_stdout": true
                }),
                success: function(data, textStatus, jqXHR) {
                    $("#output").val($("#output").val() + "\nSubmission created.");
                    setTimeout(function() { check(data["token"]) }, 1000);
                },
                error: errorHandler
            });
        }

        $("body").keydown(function (e) {
            if (e.ctrlKey && e.keyCode == 13) {
                run();
            }
        });

        $("textarea").keydown(function (e) {
            if (e.keyCode == 9) {
                e.preventDefault();
                var start = this.selectionStart;
                var end = this.selectionEnd;

                var append = "    ";
                $(this).val($(this).val().substring(0, start) + append + $(this).val().substring(end));

                this.selectionStart = this.selectionEnd = start + append.length;
            }
        });
        $(document).ready(function(){
            $("#lang").change(function(){
                var selectedCountry = $(this).children("option:selected").val();
                if( selectedCountry.localeCompare("C++") == 0){
                    document.getElementById("source").innerHTML = '#include <iostream>\nint main() {\n   std::cout << "Hello World!";\n return 0;\n}';
                    document.getElementById("defaultNum").innerHTML = "<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>"
                }else if( selectedCountry.localeCompare("Bash") == 0){
                    document.getElementById("source").innerHTML = '#!/bin/bash\necho Hello World  ';
                    document.getElementById("defaultNum").innerHTML = "<span>1</span><span>2</span>"
                }else if( selectedCountry.localeCompare("C#") == 0){
                    document.getElementById("source").innerHTML = 'namespace HelloWorld\n { \n  class Hello {\n  static void Main(string[] args)\n   {\n    System.Console.WriteLine("Hello World!");\n   }\n  }\n }  ';
                    document.getElementById("defaultNum").innerHTML = "<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span>"
                }else if( selectedCountry.localeCompare("C") == 0){
                    document.getElementById("source").innerHTML = '#include <stdio.h>\nint main() {\n printf("Hello, World!");\n return 0;\n}';
                    document.getElementById("defaultNum").innerHTML = "<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>"
                }else if( selectedCountry.localeCompare("Java") == 0){
                    document.getElementById("source").innerHTML = 'public class Main {\n public static void main(String[] args) {\n   System.out.println("Hello, World!");\n  }\n}';
                    document.getElementById("defaultNum").innerHTML = "<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>"
                }else if( selectedCountry.localeCompare("Python") == 0){
                    document.getElementById("source").innerHTML = "print('Hello, world!')";
                    document.getElementById("defaultNum").innerHTML = "<span>1</span>"
                }else if( selectedCountry.localeCompare("Ruby") == 0){
                    document.getElementById("source").innerHTML = 'puts "Hello, World!"';
                    document.getElementById("defaultNum").innerHTML = "<span>1</span>"
                }
            });    
        });

