# Scene entities

ArcadeScene owns Environment, IdeaGrabberMachine, Bulbee and Coinie. Machine owns Cabinet, Marquee, CoinSlot, ClawAssembly, CapsulePit, Chute and OutputRack. ClawAssembly owns Carriage, Cable and Claw. OutputRack has five named capsule positions. Each capsule is independently addressable but shares geometry, texture and material. Heroes have a body and separate hands/feet under named pivot groups. No ingredient assignment or gameplay state exists yet. Resources are disposed once via the scene owner.
