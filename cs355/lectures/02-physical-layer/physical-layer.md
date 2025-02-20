# Physical Layer

The physical layer deals with the bit by bit delivery of data.

It is concerned with the hardware devices and various transmission mediums and how data is encoded on them.

## Cables

Cables are typically what we call point to point connections, without any additional hardware they can only connect two devices together.

In modern applications there are two major types of cable, copper cables arranged in twisted pair, and fiber optic ones.

### Twisted Pair

Copper cables use voltage modulation to encode bits of data.  Typically an electrical charge on the cable indicates a bit is turn on, and no charge indicates a bit is turned off, but there are other more complex line coding formats.  A Network Interface Card (or NIC) sits between each computer and is in charge of converting bits of data into electrical current, as well as the reverse when on the receiving end.

Twisted pairs get their name from the fact that they contains multiple pairs of copper cables twisted together.  But why are they constructed like this?

The technical challenges with copper cables is due to the magnetic field that is created when an electrical current passes through it.  This magnetic field can induce noise on other nearby cables.  This interference is called crosstalk.

Techniques used to minimize crosstalk comes in two part:

* We want to shield the cable from external noise and
* We want to reduce the amount of noise a cable creates when a current passes through it.



In order to create an electrical circuit we will need two wires that form a closed loop.  These two wires will have opposite polarities, one positive and one negative.  Each of these wires will create it's own separate magnetic field.  Because the wires have opposite polarities, the magnetic fields created are also opposite.  If we keep these two wires close together, those magnetic fields will mostly cancel out minimizing the amount of noise generated.

Pairing these wires also imparts some shielding.  If both positive and negative wires are very close to each other, external noise should be applied equally to both positive and negative ends negating their total effect.



Theoretically we could eliminate the noise generated entirely if these wires could overlap on top of each other, creating completely opposite magnetic fields.

Because the wires and their protective shielding take up physical space however, it is not possible to overlap the two wires, but twisting each of these pairs togethers, creates a similar affect because the two wires now share the same average position, and so the magnetic fields created will mostly overlap, neutralizing each other.

Without going too deep into the electrical engineering side of things, copper twisted pairs have several categories which regulate the specifications of each cable.  High Category Cables have stricter requirements like a thicker diameter and a higher twist rate to minimize crosstalk and guarantee faster speeds.

|        | Length (m)          | Speed    |
| ------ | ------------------- | -------- |
| Cat-5  | 100                 | 100 Mb/s |
| Cat-5e | 100                 | 1GB/s    |
| Cat-6  | 100 / 55 for 10Gb/s | 10GB/s   |
| Cat-6a | 100                 | 10GB/s   |



### Fiber Optical 

Fiber cables use light modulation to transmit data.  The cable itself is composed of one or more thin glass tubes called the core, wrapped in layers of cladding (which we can think of as material with a low refractive index, used to keep the light inside).

The theoretical maximum speed of optical cables is bound by the speed of light, but only if the signal moved perfectly parallel to the cable.  In actual application when transmitting signal over long distances (of over 100km) there needs to be amplifiers along the path, to compensate for attenuation losses due to the signal being smeared each time the light is reflected, as it bounces along the cladding.

The internet backbone is predominantly made of fiber because of the increased bandwidth requirements.  Companies like Google Fiber and Verizon FIOS are entering the consumer market to deliver Fiber to residential homes.



## Channel Type

Next lets talk about the various channel types available:

### Simplex

A simplex communication channel provides unidirectional or one way transfer of data.  The most notable example that we discussed previously was the homing pigeons, but more modern examples include:

* TV and Computer Monitor
* Security Camera Feeds
* Sound Systems
* Baby Monitors

### Duplex

In contrast, a duplex communication channel allows for two way flow of data.  This is further segmented into two categories Full Duplex where both parties can communicate simultaneously and Half duplex where parties must take turns communicating (as an example you can think of walkie talkies).

Cables typically operate in either fully duplex or simplex mode (for scenarios where there is no need for data to flow bidirectionally).  Some cables do have support for half-duplex in the event that it becomes partially damaged.



## Hubs (Repeater)

The hub (or repeater) is a largely historical physical layer hardware device.  A cable being point to point, only allows two devices to be connected, hubs can be thought of as an extension of a cable allowing an arbitrary number of devices to form a network.  When a signal is received on a hub that signal is duplicated to all other physical ports.  A devices on a hub winds up talking to all other devices.

Hubs can support an unlimited number of devices by joining multiple hub together.  It is up to individual machines to filter out which messages were intended for them.  This was in the 1970s so security was not a real concern, as typically these devices would form a single internal network.

The problem with hubs is that when there is more than two devices they create a collision domain.  A collision domain is a network segment where only one device can communicate at a time.  Multiple senders will cause interference.

### Fully Duplex does not mean it can combine multiple signals

But Didn't we say that duplex cables are capable of sending and receiving signals at the same time?

Yes, they can send and receive at the same time, but it cannot receive two different signals.

Consider the following network with three devices, if A and B are both transmitting at the same time, The signal that C receives will be useless as it's just a combination of A and B's signal.  If two or more devices try to use the network at the same time, the data received will get corrupted.  The more devices you add to a network hub the more likely chance that the collision domain causes problems.

These limitations were addressed with the Carrier-sense multiple access (or CSMA) algorithm, where devices would try to share the network cable.



### Carrier-sense multiple access

In carrier sense multiple access a node verifies the absence of traffic before transmitting.

One of the original growing pains of this protocol was that it only performed this check before sending and assumed that all other network traffic would follow CSMA.  This was not the case and other traffic from legacy applications would immediate begin transmitting causing all data to be corrupted.

This protocol was improved with the addition of collision detection. In Carrier-sense multiple access with collision detection (CSMA / CD) transmission immediately stops as soon as a collision is detected.  This allows devices that do not support CSMA to continue to use the network.  They would be given priority access to the network resources, which does seem unfair, but the alternative is that nobody can use the network.

The next improvement was the addition of collision avoidance (in CSMA / CA) a random waiting interval was added after detecting the network is in use.  This was added to address the problem of live lock, where two devices would begin using the network at the same time, only to see that someone else is using it, busy waiting the same fixed interval and then trying again.  Randomizing the wait interval made the chance of this happening multiple times very unlikely.

### Network Switch

The hub was largely obsoleted in the 1990s with the invention of the Network Switch.  The switch which included an added processor is capable of inspecting the contents of each frame and would only forward traffic along it's intended path.  This eliminated the problem of collision domains in networks connected by a single switch.  Collision domains still exist in networks with multiple switches, but only when communication needs to cross to another switch.

Because the switch inspects the data and uses that information to determine which physical port to forward the data to, it is considered a Data Link layer device.  We will go more in-depth on how switch's work in a later lecture.



## Wireless

Wireless technology uses radio frequency waves to encode data.  WiFi capable devices started appearing around 1997.  The most common frequencies used nowadays are the 2.4 and 5GHz bands.

Wireless connections operate at half duplex, multiple devices can share a network by sending special control frames that detail information like who is currently sending and how long they have the channel for.

We will go more in depth on this topic in the Data Link layer discussion because we need to first define what a frame is, but suffice to say the carrier sense multiple access / collision avoidance protocols that we originally used with hubs have been adapted for WiFi.

This is important to keep in mind; it is fairly common for new hardware to obsolesces an existing technology, but the algorithms and protocols that were once used will continue to have useful applications elsewhere.

















