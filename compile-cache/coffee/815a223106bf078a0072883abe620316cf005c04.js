(function() {
  module.exports = {
    diffWords: {
      title: 'Show Word Diff',
      description: 'Diffs the words between each line when this box is checked.',
      type: 'boolean',
      "default": true,
      order: 1
    },
    ignoreWhitespace: {
      title: 'Ignore Whitespace',
      description: 'Will not diff whitespace when this box is checked.',
      type: 'boolean',
      "default": false,
      order: 2
    },
    muteNotifications: {
      title: 'Mute Notifications',
      description: 'Mutes all warning notifications when this box is checked.',
      type: 'boolean',
      "default": false,
      order: 3
    },
    scrollSyncType: {
      title: 'Sync Scrolling',
      description: 'Syncs the scrolling of the editors.',
      type: 'string',
      "default": 'Vertical + Horizontal',
      "enum": ['Vertical + Horizontal', 'Vertical', 'None'],
      order: 4
    },
    leftEditorColor: {
      title: 'Left Editor Color',
      description: 'Specifies the highlight color for the left editor.',
      type: 'string',
      "default": 'green',
      "enum": ['green', 'red'],
      order: 5
    },
    rightEditorColor: {
      title: 'Right Editor Color',
      description: 'Specifies the highlight color for the right editor.',
      type: 'string',
      "default": 'red',
      "enum": ['green', 'red'],
      order: 6
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvc3BsaXQtZGlmZi9saWIvY29uZmlnLXNjaGVtYS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsU0FBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sZ0JBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSw2REFEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxNQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsTUFJQSxLQUFBLEVBQU8sQ0FKUDtLQURGO0FBQUEsSUFNQSxnQkFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sbUJBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSxvREFEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxNQUdBLFNBQUEsRUFBUyxLQUhUO0FBQUEsTUFJQSxLQUFBLEVBQU8sQ0FKUDtLQVBGO0FBQUEsSUFZQSxpQkFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sb0JBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSwyREFEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxNQUdBLFNBQUEsRUFBUyxLQUhUO0FBQUEsTUFJQSxLQUFBLEVBQU8sQ0FKUDtLQWJGO0FBQUEsSUFrQkEsY0FBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sZ0JBQVA7QUFBQSxNQUNBLFdBQUEsRUFBYSxxQ0FEYjtBQUFBLE1BRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxNQUdBLFNBQUEsRUFBUyx1QkFIVDtBQUFBLE1BSUEsTUFBQSxFQUFNLENBQUMsdUJBQUQsRUFBMEIsVUFBMUIsRUFBc0MsTUFBdEMsQ0FKTjtBQUFBLE1BS0EsS0FBQSxFQUFPLENBTFA7S0FuQkY7QUFBQSxJQXlCQSxlQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxtQkFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLG9EQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sUUFGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLE9BSFQ7QUFBQSxNQUlBLE1BQUEsRUFBTSxDQUFDLE9BQUQsRUFBVSxLQUFWLENBSk47QUFBQSxNQUtBLEtBQUEsRUFBTyxDQUxQO0tBMUJGO0FBQUEsSUFnQ0EsZ0JBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLG9CQUFQO0FBQUEsTUFDQSxXQUFBLEVBQWEscURBRGI7QUFBQSxNQUVBLElBQUEsRUFBTSxRQUZOO0FBQUEsTUFHQSxTQUFBLEVBQVMsS0FIVDtBQUFBLE1BSUEsTUFBQSxFQUFNLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FKTjtBQUFBLE1BS0EsS0FBQSxFQUFPLENBTFA7S0FqQ0Y7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/C:/Users/MNP/.atom/packages/split-diff/lib/config-schema.coffee
