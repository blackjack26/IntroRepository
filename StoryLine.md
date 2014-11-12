## Starting Room
#### Location: 
    Confinement Room
#### Script
    __Voice:__ "Okay everybody, your first task will be to get yourself out of your respective rooms, good luck!"
    __Actions:__
        - _Look Ahead:_ "You see a big metal door, it appears to be locked tight"
            - _Inspect:_ "There is some sort of circular opening near the handle of the door"
                - _Think:_ "Maybe some sort of key goes here"
                - _Punch:_ "You hit the door and hurt your hand...good job"
                - _Look Through:_ "You see a long hallway with other doors like yours"
                - _IF(hasKey) Use Key:_ "The key fits and the door swinngs open"
        - _Look Behind:_ "There's nothing but a concrete wall"
            - _Inspect:_ "The wall has a tile pattern with all sorts of shapes and a small hole in the middle"
                - _Put Finger in Hole:_ ~~~"What shape do you see?"~~~
                    - _Circle:_ "A panel on the wall opened up"
                        - _Inspect:_ "You found a key!"
                    - _[Anything]_: "Strike [num]!"
                        - _IF(3):_ "You have been terminated" GOTO: START;
                - _Punch:_ "You hit the wall and you cut your hand"
        - _Think:_ "How did I even get in this place? I don't remember anything"
    __Items:__
        - Key
