## Game Script by Location
#### Location: 
    Confinement Room
#### Script
    Voice: "Okay everybody, your first task will be to get yourself out of your respective rooms, good luck!"
    Actions:
        - Look Ahead: "You see a big metal door, it appears to be locked tight"
            - Inspect: "There is some sort of circular opening near the handle of the door"
                - Think: "Maybe some sort of key goes here"
                - Punch: "You hit the door and hurt your hand...good job"
                - Look Through: "You see a long hallway with other doors like yours"
                - IF(hasKey) Use Key: "The key fits and the door swinngs open"
        - Look Behind: "There's nothing but a concrete wall"
            - Inspect: "The wall has a tile pattern with all sorts of shapes and a small hole in the middle"
                - Put Finger in Hole: ~~~"What shape do you see?"~~~
                    - Circle: "A panel on the wall opened up"
                        - Inspect: "You found a key!"
                    - [Anything]: "Strike [num]!"
                        - IF(3): "You have been terminated" GOTO: START;
                - Punch: "You hit the wall and you cut your hand"
        - Think: "How did I even get in this place? I don't remember anything"
    Items:
        - Key