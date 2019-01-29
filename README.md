# Kettle - An instant-updating, auth free, cloud storage platform.
__Key Features__
+ Create unauthenticated "buckets" called Kettles that allow you to store text and images
+ Live updating using Google's Firebase platform
+ Ability to see list of all Kettles, or directly access a Kettle via `kettle.herokuapp.com/kettle_name`

__UI__
+ Utilized [Ant Design](https://github.com/ant-design/ant-design) to build the UI. Decided to go with Antd because I wanted minimal code to get up and running, that still looked great, and wasn't Material

__Backend__
+ The original intent of this project was to explore Firebase
+ My only database experience being MySQL prior to starting this project, I wanted to get my feet wet with Backend as a Service and the NoSQL architecture.
+ Used Firebase Database to store text and image information, and Firebase Storage to store the actual images.


__Preview__
![](kettle.gif)
_Two separate browser instances running Kettle from Heroku (i.e. not local)._
