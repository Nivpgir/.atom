(function() {
  var CodeContext, CodeContextBuilder, Emitter, grammarMap;

  CodeContext = require('./code-context');

  grammarMap = require('./grammars');

  Emitter = require('atom').Emitter;

  module.exports = CodeContextBuilder = (function() {
    function CodeContextBuilder(emitter) {
      this.emitter = emitter != null ? emitter : new Emitter;
    }

    CodeContextBuilder.prototype.destroy = function() {
      return this.emitter.dispose();
    };

    CodeContextBuilder.prototype.buildCodeContext = function(editor, argType) {
      var codeContext, cursor;
      if (argType == null) {
        argType = 'Selection Based';
      }
      if (editor == null) {
        return;
      }
      codeContext = this.initCodeContext(editor);
      codeContext.argType = argType;
      if (argType === 'Line Number Based') {
        editor.save();
      } else if (codeContext.selection.isEmpty() && (codeContext.filepath != null)) {
        codeContext.argType = 'File Based';
        if (editor != null ? editor.isModified() : void 0) {
          editor.save();
        }
      }
      if (argType !== 'File Based') {
        cursor = editor.getLastCursor();
        codeContext.lineNumber = cursor.getScreenRow() + 1;
      }
      return codeContext;
    };

    CodeContextBuilder.prototype.initCodeContext = function(editor) {
      var codeContext, filename, filepath, ignoreSelection, lang, selection, textSource;
      filename = editor.getTitle();
      filepath = editor.getPath();
      selection = editor.getLastSelection();
      ignoreSelection = atom.config.get('script.ignoreSelection');
      if (selection.isEmpty() || ignoreSelection) {
        textSource = editor;
      } else {
        textSource = selection;
      }
      codeContext = new CodeContext(filename, filepath, textSource);
      codeContext.selection = selection;
      codeContext.shebang = this.getShebang(editor);
      lang = this.getLang(editor);
      if (this.validateLang(lang)) {
        codeContext.lang = lang;
      }
      return codeContext;
    };

    CodeContextBuilder.prototype.getShebang = function(editor) {
      var firstLine, lines, text;
      if (process.platform === 'win32') {
        return;
      }
      text = editor.getText();
      lines = text.split("\n");
      firstLine = lines[0];
      if (!firstLine.match(/^#!/)) {
        return;
      }
      return firstLine.replace(/^#!\s*/, '');
    };

    CodeContextBuilder.prototype.getLang = function(editor) {
      return editor.getGrammar().name;
    };

    CodeContextBuilder.prototype.validateLang = function(lang) {
      var valid;
      valid = true;
      if (lang === 'Null Grammar' || lang === 'Plain Text') {
        this.emitter.emit('did-not-specify-language');
        valid = false;
      } else if (!(lang in grammarMap)) {
        this.emitter.emit('did-not-support-language', {
          lang: lang
        });
        valid = false;
      }
      return valid;
    };

    CodeContextBuilder.prototype.onDidNotSpecifyLanguage = function(callback) {
      return this.emitter.on('did-not-specify-language', callback);
    };

    CodeContextBuilder.prototype.onDidNotSupportLanguage = function(callback) {
      return this.emitter.on('did-not-support-language', callback);
    };

    return CodeContextBuilder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvc2NyaXB0L2xpYi9jb2RlLWNvbnRleHQtYnVpbGRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsb0RBQUE7O0FBQUEsRUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUixDQURiLENBQUE7O0FBQUEsRUFHQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FIRCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsNEJBQUUsT0FBRixHQUFBO0FBQTBCLE1BQXpCLElBQUMsQ0FBQSw0QkFBQSxVQUFVLEdBQUEsQ0FBQSxPQUFjLENBQTFCO0lBQUEsQ0FBYjs7QUFBQSxpQ0FFQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQUEsRUFETztJQUFBLENBRlQsQ0FBQTs7QUFBQSxpQ0FlQSxnQkFBQSxHQUFrQixTQUFDLE1BQUQsRUFBUyxPQUFULEdBQUE7QUFDaEIsVUFBQSxtQkFBQTs7UUFEeUIsVUFBUTtPQUNqQztBQUFBLE1BQUEsSUFBYyxjQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLFdBQUEsR0FBYyxJQUFDLENBQUEsZUFBRCxDQUFpQixNQUFqQixDQUZkLENBQUE7QUFBQSxNQUlBLFdBQVcsQ0FBQyxPQUFaLEdBQXNCLE9BSnRCLENBQUE7QUFNQSxNQUFBLElBQUcsT0FBQSxLQUFXLG1CQUFkO0FBQ0UsUUFBQSxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUEsQ0FERjtPQUFBLE1BRUssSUFBRyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQXRCLENBQUEsQ0FBQSxJQUFv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

//# sourceURL=/C:/Users/MNP/.atom/packages/script/lib/code-context-builder.coffee
