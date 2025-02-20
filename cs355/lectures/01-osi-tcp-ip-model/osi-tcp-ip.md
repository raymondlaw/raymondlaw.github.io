# OSI & TCP/IP Model

In this course we will be looking at the inner workings of various protocols that allow the Internet as we know it to exist.  Regarding this, there are two conceptual models that are commonly cited.  The largely historical Open Systems Interconnection (or OSI) model, and the one we will be mainly focus on, the Internet Suite (or TCP/IP) model.



## Conceptual Models

Both OSI and TCP/IP are conceptual models built around the notion of layering.  The OSI Model has 7 layers while the TCP/IP model has both 4- and 5-layer variants.

Each of these layers represents an abstraction.  Higher layer protocols can assume that the lower layer protocols just work by using their provided methods.  

> For example, when writing application layer code for some website, we largely do not need to concern ourselves with whether the user's connections is wired or wireless.  This is because our application assumes that a lower layer (data link layer in this case) has taken care of that.  

Both the OSI and TCP/IP model are organizational systems that bucket Internet protocols into layers.  This rigid bucket system is less than ideal, as there are some protocols that bridge two or more layers, and other protocols which have sublayer characteristics, in that one protocol depends on another, but are still bucketed together.  

Don't worry too much about what specific layer a protocol falls into on the OSI or TCP/IP models.  It's more important to understand each of the protocols we'll be looking at and how layering allows us to black box previously discussed protocols and abstract away their complexities.



## Communication Protocols

Processes that exchange bit streams must first agree on a protocol.  A **protocol** is a system of rules that allow two or more entities to transmit or receive information.   These rules determines all aspects of data communication including:

* Syntax, (which is the structure, or how the information encoded) 
* Semantics (which is the meaning, or what is being communicated)
* Synchronization (which is the timing, or when and at what speed can messages be communicated at )
* Error recovery methods [if applicable] (these deals with detecting an error state and possibly resolving it)



### Historical Communications Protocols

First a bit of history, Communication Protocol predate computers.  

#### Homing Pigeons


The earliest recorded usage of them can be traced back to 776BC during the first Olympics.  Homing pigeons (yes, the birds) were used to send the results of the Olympics from the city of Olympia back to the capital of Athens.

Homing pigeons are an interesting communications medium, because they operate in one direction only.  They can only fly home and because of that, we cannot use the same bird to send messages back.  This property is called unidirectionality.

When we get to the physical layer, we will look at the properties of various transmission mediums like copper, fiber, and wireless and how those choices affect the design of protocols that utilize them.

#### Hydraulic Semaphore

Greek Hydraulic semaphores were used in 400 BC.  With this example I can give a clear distinction between a transmission medium and a communications protocol.  

How it works is, on two separate hilltops, sits two identical containers filled with water.  Inside each container is a vertical rod with messages attached at various depths, again these are identical.  When one side wants to send a message, they would use a torch to signal to the other side.  

Upon seeing the light, the receiver lights a torch as well, and once synchronized, both open a valve on their container, slowly letting the water out.  Because the containers are identical,  water flows out of both at the same rate.  When the water level reaches the height of the message that was intended to be sent the valve is closed and the torch is put out, signaling the end of transmission.

The transmission medium is just the light emitted from the torch.  The protocol also includes all the other contraptions and coordination between both entities in order to send and receive the message, if either party did not have prior knowledge of how the system worked, the message could not be transmitted.  In this way we can think of a protocol as a distributed algorithm in which multiple parties work together to facilitate message exchange.



#### Protocols are strict

Computer Protocols are rigidly defined, when writing the specifications of one there needs to be no ambiguity.

Consider the following sentences

>  "My favorite color is blue" and "Blue is my favorite color." 

We as people can break down each sentence and see that they have the same meaning, despite the words being in a different order.  Unfortunately, computer protocols are not as smart *yet*, and require all communicating parties to follow a specified syntax. 

Typically the specifications for popular open protocols will be available as a Request for Comments (or RFC) publication.

#### Optical Telegraph

The next historical example of interest is the optical telegraph.  These were relays of large towers with mechanical arms on top.  Messages would be encoded by pulling levers that moved the arms in a systematic way.  Each tower would be staffed with workers who would keep watch of neighboring towers and if a neighbor were to transmit a message, they would record the towers movements and repeat them for the next tower, effectively forwarding the message down the line.

Each of the major hub cities contained a codebook where a trusted official would encode and decode messages that were being sent and received.  The operators in the middle were not aware of the contents of the messages they were receiving as they did not have access to the codebook.  This advancement can arguably be considered the first implementation of end to end encryption.

There's also an interesting story about how two French brothers exploited a flaw in the optical telegraph system to encode arbitrary messages and used that to game the stock market.  I'll link to video by Tom Scott that details the escapade.



#### Electric Telegraph and Undersea Cables

The electric telegraph and subsequent invention of Morse code was the next major innovation that pushed communications technologies forward.  

Copper cables were so much more cost effective than all the previous technologies, that within a few short years optical telegraphs relays would be completely abandoned for electric telegraph networks, which spanned from London all the way to India.  

The technology proved so useful that expeditions to connect the Americas were also being conducted by various trading companies trying to link to the two continents.  

The first transatlantic cable that was successfully planted in 1858, connected Newfoundland with Ireland.  The first transatlantic message to be sent was from Queen Victoria to US President Buchanan congratulating him on the successful project.

But this cable had many problems from the start.  The message took 16 hours to send because of noise, and ultimately the cable was only usable for a month due to it getting fried when the voltage was increased in a debugging attempt gone wrong.

Innovations in cable shielding over the next few years resulted in the first usable transatlantic cable to be planted in 1866.

The first message sent on this cable was:

> A treaty of peace has been signed between Austria and Prussia

In modern days we still use copper cables for most home networks.  Fiber connections which were originally only used for undersea cables and large-scale server farms have only just begun to make their way into residential homes.



## Layers of Abstraction

When considering a computer, there are millions of hardware choices out there.  How do we ensure that all these devices can communicate with each other?  A layered conceptual model means that hardware developers do not need to worry about higher layer protocols which are taken care of by operating systems, they only need to ensure that their networking hardware has the ability to take a packet of data supplied by the operating system and convert it into a physical signal (and the process in reverse when receiving data.)

This standardization and abstraction of responsibility ensures that devices connected to the Internet can easily communicate with each other.

Layering also provides defined roles and modularity for each layer, which allows specific protocols to be easily changed out, should the requirements change.  You can think about this as changing from a wired connection to a wireless connection (swapping the data link layer out), none of the higher layer protocols should be affected with this change.



Next let's look at the layers of both the OSI and the TCP / IP model.

### Open Systems Interconnection (OSI Model)

The Open Systems Interconnection (or OSI model) is a largely historical 7-layer conceptual model.

The layers are:

| # | Layer        | PDU     | Addressing | Protocols | Hardware |
| - | ------------ | ------- | ---------- | ---------- | ---------- |
| 7 | Application  | Message / Data |  |HTTP, FTP, SSH, SFTP, ...||
| 6 | Presentation |      ||||
| 5 | Session      |      ||                           ||
| 4 | Transport    | Segment (TCP)<br>Datagram (UDP) |Logical Port|TCP, UDP||
| 3 | Network      | Packet  |IP Address|IPv4, IPv6|Routers|
| 2 | Data Link    | Frame   |MAC Address|Ethernet, 802.11|Bridges, Switches, NIC|
| 1 | Physical     | Bit     |N/A|| Cables, Repeaters      |



The physical layer focuses on how information is encoded.  Whether that be with:

* coppers cables, where data is encoded as an electric current, 

* optical cables, where data is encoded as pulses of light, 

* or with wireless, where data is encoded to radio waves.

  

The data link layer deals with encoding data from a computing device on to a communications medium and transmitting data from one network device to the next.  It is important to know that the Data Link layer only facilitates transport of data across a single hop from one network node to another.

The network layer is built on top of multiple data link layer exchanges and provides end to end transport of data.  This process of routing traffic across multiple devices is called internetworking.

Modern devices usually have multiple applications that each need access to the Internet.  Often these applications are running concurrently.  The transport layer provides multiplexing and demultiplexing of data between different pieces of software running on the same device.  It ensures that data arriving on a computer gets delivered to the correct application.

The session layer provide state management capabilities including checkpointing and recovery.

The presentation layer, deals with character encoding, compression, and encryption.

Finally, the application layer is where the protocols and interfaces used in process-to-process communications exist.  When developing software that utilizes computer networks, the application layer is where you decide how to structure and interpret the data that is being transmitted and what other applications will be compatible.



### Internet Protocol Suite (TCP/IP Model)

The Internet protocol suite or TCP /IP conceptual model, which has 4- and 5-layer variants, is what is primarily used to model the Internet nowadays.  It's a more streamlined model with presentation and session layer functionality combined into the application layer.

In this example we see the 5- layer variant which includes

| #    | Layer       | PDU                               | Addressing   | Protocols                                                    | Hardware               |
| ---- | ----------- | --------------------------------- | ------------ | ------------------------------------------------------------ | ---------------------- |
| 5    | Application | Message                           | N/A          | HTTP, FTP, SSH, SFTP, ...                                    |                        |
| 4    | Transport   | Segment (TCP) <br/>Datagram (UDP) | Logical Port | TCP, UDP                                                     |                        |
| 3    | Network     | Packet                            | IP Address   | IPv4, IPv6                                                   | Routers                |
| 2    | Data Link   | Frame                             | MAC Address  | Ethernet, 802.11<br/>PPP (Dial up), <br/>Frame Relay (ISDN),<br/> | Bridges, Switches, NIC |
| 1    | Physical    | Bit                               | N/A          |                                                              | Cables, Repeaters      |



The 4-layer variant removes the physical layer, often citing that the Internet Protocol Suite deals with the protocols used to encode and decode messages and not the hardware itself. 

Because of the numbering issues this causes when comparing with the OSI Model, and my plans to go more in-depth regarding the physical layer, throughout this course I will use the 5-layer model, but will also avoid using layer numbers and will be referencing each layer by its name.

#### Protocol Data Units (PDU)

Protocol Data Units (or PDU) represent the atomic unit of information for each layer.  As we go down from the application layer to the physical, each layer in between will add its own header data.  These headers provide information like:

* Where should the message be delivered to? 
* Where is the message coming from?
* Did this data arrive uncorrupted?
* If corrupted, should it be retransmitted?



### Addressing

When transmitting data, we need some way to specify the sender and recipient.  The Internet has multiple address fields to facilitate this.  We have specific header fields that can identify:

* physical hardware (using the MAC address)
* networks (using the IP address)
* applications (using the logical port) 



### Hardware

We will go more in-depth about specific hardware devices in the next discussion, but hardware only goes up to the network layer, because the network layer facilitates end-to-end delivery of messages.  The packet has reached its final hardware destination by the time the transport layer header is being removed.  Support for higher layer protocols is done via software.



## Next

In the next few lectures we will go more in-depth with each layer starting the physical.  We will examine various types of transmission mediums from cables to wireless.  We will also look at both historically important and modern protocols.











