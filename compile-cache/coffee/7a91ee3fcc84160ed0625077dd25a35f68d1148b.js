(function() {
  module.exports = {
    autoToggle: {
      title: "Auto Toggle",
      description: "Toggle on start.",
      type: "boolean",
      "default": true
    },
    comboMode: {
      type: "object",
      properties: {
        enabled: {
          title: "Combo Mode - Enabled",
          description: "When enabled effects won't appear until reach the activation threshold.",
          type: "boolean",
          "default": true,
          order: 1
        },
        activationThreshold: {
          title: "Combo Mode - Activation Threshold",
          description: "Streak threshold to activate the power mode.",
          type: "integer",
          "default": 50,
          minimum: 1,
          maximum: 1000
        },
        streakTimeout: {
          title: "Combo Mode - Streak Timeout",
          description: "Timeout to reset the streak counter. In seconds.",
          type: "integer",
          "default": 10,
          minimum: 1,
          maximum: 100
        },
        exclamationEvery: {
          title: "Combo Mode - Exclamation Every",
          description: "Shows an exclamation every streak count.",
          type: "integer",
          "default": 10,
          minimum: 1,
          maximum: 100
        },
        exclamationTexts: {
          title: "Combo Mode - Exclamation Texts",
          description: "Exclamations to show (randomized).",
          type: "array",
          "default": ["Super!", "Radical!", "Fantastic!", "Great!", "OMG", "Whoah!", ":O", "Nice!", "Splendid!", "Wild!", "Grand!", "Impressive!", "Stupendous!", "Extreme!", "Awesome!"]
        },
        opacity: {
          title: "Combo Mode - Opacity",
          description: "Opacity of the streak counter.",
          type: "number",
          "default": 0.6,
          minimum: 0,
          maximum: 1
        }
      }
    },
    screenShake: {
      type: "object",
      properties: {
        minIntensity: {
          title: "Screen Shake - Minimum Intensity",
          description: "The minimum (randomized) intensity of the shake.",
          type: "integer",
          "default": 1,
          minimum: 0,
          maximum: 100
        },
        maxIntensity: {
          title: "Screen Shake - Maximum Intensity",
          description: "The maximum (randomized) intensity of the shake.",
          type: "integer",
          "default": 3,
          minimum: 0,
          maximum: 100
        },
        enabled: {
          title: "Screen Shake - Enabled",
          description: "Turn the shaking on/off.",
          type: "boolean",
          "default": true
        }
      }
    },
    playAudio: {
      type: "object",
      properties: {
        enabled: {
          title: "Play Audio - Enabled",
          description: "Play audio clip on/off.",
          type: "boolean",
          "default": false
        },
        volume: {
          title: "Play Audio - Volume",
          description: "Volume of the audio clip played at keystroke.",
          type: "number",
          "default": 0.42,
          minimum: 0.0,
          maximum: 1.0
        }
      }
    },
    particles: {
      type: "object",
      properties: {
        enabled: {
          title: "Particles - Enabled",
          description: "Turn the particles on/off.",
          type: "boolean",
          "default": true,
          order: 1
        },
        colours: {
          type: "object",
          properties: {
            type: {
              title: "Colours",
              description: "Configure colour options",
              type: "string",
              "default": "cursor",
              "enum": [
                {
                  value: 'cursor',
                  description: 'Particles will be the colour at the cursor.'
                }, {
                  value: 'random',
                  description: 'Particles will have random colours.'
                }, {
                  value: 'fixed',
                  description: 'Particles will have a fixed colour.'
                }
              ],
              order: 1
            },
            fixed: {
              title: "Fixed colour",
              description: "Colour when fixed colour is selected",
              type: "color",
              "default": "#fff"
            }
          }
        },
        totalCount: {
          type: "object",
          properties: {
            max: {
              title: "Particles - Max Total",
              description: "The maximum total number of particles on the screen.",
              type: "integer",
              "default": 500,
              minimum: 0
            }
          }
        },
        spawnCount: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Spawned",
              description: "The minimum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 5
            },
            max: {
              title: "Particles - Maximum Spawned",
              description: "The maximum (randomized) number of particles spawned on input.",
              type: "integer",
              "default": 15
            }
          }
        },
        size: {
          type: "object",
          properties: {
            min: {
              title: "Particles - Minimum Size",
              description: "The minimum (randomized) size of the particles.",
              type: "integer",
              "default": 2,
              minimum: 0
            },
            max: {
              title: "Particles - Maximum Size",
              description: "The maximum (randomized) size of the particles.",
              type: "integer",
              "default": 4,
              minimum: 0
            }
          }
        }
      }
    },
    excludedFileTypes: {
      type: "object",
      properties: {
        excluded: {
          title: "Prohibit activate-power-mode from enabling on these file types:",
          description: "Use comma separated, lowercase values (i.e. \"html, cpp, css\")",
          type: "array",
          "default": ["."]
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiZmlsZTovLy9DOi9Vc2Vycy9NTlAvLmF0b20vcGFja2FnZXMvYWN0aXZhdGUtcG93ZXItbW9kZS9saWIvY29uZmlnLXNjaGVtYS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsVUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sYUFBUDtBQUFBLE1BQ0EsV0FBQSxFQUFhLGtCQURiO0FBQUEsTUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLE1BR0EsU0FBQSxFQUFTLElBSFQ7S0FERjtBQUFBLElBTUEsU0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLE1BQ0EsVUFBQSxFQUNFO0FBQUEsUUFBQSxPQUFBLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyxzQkFBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLHlFQURiO0FBQUEsVUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFVBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxVQUlBLEtBQUEsRUFBTyxDQUpQO1NBREY7QUFBQSxRQU9BLG1CQUFBLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyxtQ0FBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLDhDQURiO0FBQUEsVUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFVBR0EsU0FBQSxFQUFTLEVBSFQ7QUFBQSxVQUlBLE9BQUEsRUFBUyxDQUpUO0FBQUEsVUFLQSxPQUFBLEVBQVMsSUFMVDtTQVJGO0FBQUEsUUFlQSxhQUFBLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyw2QkFBUDtBQUFBLFVBQ0EsV0FBQSxFQUFhLGtEQURiO0FBQUEsVUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFVBR0EsU0FBQSxFQUFTLEVBSFQ7QUFBQSxVQUlBLE9BQUEsRUFBUyxDQUpUO0FBQUEsVUFL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

//# sourceURL=/C:/Users/MNP/.atom/packages/activate-power-mode/lib/config-schema.coffee
