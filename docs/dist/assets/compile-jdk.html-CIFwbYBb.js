import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,o as t,e as o}from"./app-CiW81ZiS.js";const c={},d=o('<h1 id="自己编译jdk" tabindex="-1"><a class="header-anchor" href="#自己编译jdk"><span>自己编译JDK</span></a></h1><p>很多小伙伴们做<code>Java</code>开发，天天写<code>Java</code>代码，肯定离不开<code>Java</code>基础环境：<code>JDK</code>，毕竟我们写好的<code>Java</code>代码也是跑在<code>JVM</code>虚拟机上。</p><p>一般来说，我们学<code>Java</code>之前，第一步就是安装<code>JDK</code>环境。这个简单啊，我们一般直接把<code>JDK</code>从官网下载下来，安装完成，配个环境变量就可以愉快地使用了。</p><p>不过话说回来，对于这个天天使用的东西，我们难道不好奇这玩意儿它到底是怎么由源码编译出来的吗？</p><p>带着这个原始的疑问，今天准备大干一场，自己动动呆萌的小手，来编译一个属于自己的<code>JDK</code>吧！</p><h2 id="环境准备" tabindex="-1"><a class="header-anchor" href="#环境准备"><span>环境准备</span></a></h2><blockquote><p>首选说在前面的是，编译前的软件版本关系极其重要，自己在踩坑时，所出现的各种奇奇怪怪的问题几乎都和这个有关，后来版本匹配之后，就非常顺利了。</p></blockquote><p>我们来<strong>盘点和梳理</strong>一下编译一个JDK需要哪些环境和工具：</p><h3 id="_1、boot-jdk" tabindex="-1"><a class="header-anchor" href="#_1、boot-jdk"><span><strong>1、boot JDK</strong></span></a></h3><p>我们要想编译<code>JDK</code>，首先自己本机必须提前已经安装有一个<code>JDK</code>，官方称之为<code>bootstrap JDK</code>（或者称为<code>boot JDK</code>）。</p><p>比如想编译<code>JDK 8</code>，那本机必须最起码得有一个<code>JDK 7</code>或者更新一点的版本；你想编译<code>JDK 11</code>，那就要求本机必须装有<code>JDK 10</code>或者<code>11</code>。</p><blockquote><p>所以鸡生蛋、蛋生鸡又来了...</p></blockquote><h3 id="_2、unix环境" tabindex="-1"><a class="header-anchor" href="#_2、unix环境"><span><strong>2、Unix环境</strong></span></a></h3><p>编译<code>JDK</code>需要<code>Unix</code>环境的支持！</p><p>这一点在<code>Linux</code>操作系统和<code>macOS</code>操作系统上已经天然的保证了，而对于<code>Windows</code>兄弟来说稍微麻烦一点，需要通过使用<code>Cygwin</code>或者<code>MinGW/MSYS</code>这种软件来模拟。</p><p>就像官方所说：在<code>Linux</code>平台编译<code>JDK</code>一般问题最少，容易成功；<code>macOS</code>次之；<code>Windows</code>上则需要稍微多花点精力，问题可能也多一些。</p><p>究其本质原因，还是因为<code>Windows</code>毕竟不是一个<code>Unix-Like</code>内核的系统，毕竟很多软件的原始编译都离不开<code>Unix Toolkit</code>，所以相对肯定要麻烦一些。</p><h3 id="_3、编译器-编译工具链" tabindex="-1"><a class="header-anchor" href="#_3、编译器-编译工具链"><span><strong>3、编译器/编译工具链</strong></span></a></h3><p><code>JDK</code>底层源码（尤其<code>JVM</code>虚拟机部分）很多都是<code>C++/C</code>写的，所以相关编译器也跑不掉。</p><p>一图胜千言，各平台上的编译器支持如下表所示，按平台选择即可：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-3b66d5b6-272f-47bd-88f7-47146a06ef06.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_4、其他工具" tabindex="-1"><a class="header-anchor" href="#_4、其他工具"><span><strong>4、其他工具</strong></span></a></h3><p>典型的比如：</p><ul><li><code>Autoconf</code>：软件源码包的自动配置工具</li><li><code>Make</code>：编译构建工具</li><li><code>freetype</code>：一个免费的渲染库，<code>JDK</code>图形化部分的代码可能会用它</li></ul><p>好，环境盘点就到这里，接下来具体列一下我在编译<code>JDK 8</code>和<code>JDK 11</code>时分别用到的软件详细版本信息：</p><p><strong>编译JDK 8时：</strong></p><ul><li><code>操作系统</code>：macOS 10.11.6</li><li><code>boot JDK</code>：JDK 1.8.0 (build 1.8.0_201-b09)</li><li><code>Xcode版本</code>：8.2</li><li><code>编译器</code>：Version 8.0.0 (at /usr/bin/clang)</li></ul><p><strong>编译JDK 11时：</strong></p><ul><li><code>操作系统</code>：macOS 10.15.4</li><li><code>boot JDK</code>：JDK 11.0.7 (build 11.0.7+8-LTS)</li><li><code>Xcode版本</code>：11.5</li><li><code>编译器</code>：Version 11.0.3 (at /usr/bin/clang)</li></ul><p>大家在编译时如果过程中有很多问题，大概率少软件没装，或者软件版本不匹配，不要轻易放弃，需要耐心自查一下。</p><hr><h2 id="下载jdk源码" tabindex="-1"><a class="header-anchor" href="#下载jdk源码"><span>下载JDK源码</span></a></h2><p>下载<code>JDK</code>源码其实有两种方式。</p><h3 id="方式一-通过mercurial工具下载" tabindex="-1"><a class="header-anchor" href="#方式一-通过mercurial工具下载"><span><strong>方式一：通过Mercurial工具下载</strong></span></a></h3><p><code>Mercurial</code>可以理解为和<code>Git</code>一样，是另外一种代码管理工具，安装好之后就有一个<code>hg</code>命令可用。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-cd8a19ba-e9f5-4a4a-a23c-17688f0f459d.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>而<code>OpenJDK</code>的源码已经提前托管到<code>http://hg.openjdk.java.net/</code>。</p><p>因此，比如下载<code>JDK 8</code>，可直接<code>hg clone</code>一下就行，和<code>git clone</code>一样：</p><p><code>hg clone [http://hg.openjdk.java.net/jd...](https://link.segmentfault.com/?enc=Snt8gNbYV7nkV3etTe%2FGJw%3D%3D.7IrUNCuc0HOEyvjCiCBOPMEBJ09bjLifieJi0I7iwtuuIeYUdSfCkC9c4D7z9wdq) </code></p><p>同理，下载<code>JDK 11</code>：</p><p><code>hg clone [http://hg.openjdk.java.net/jd...](https://link.segmentfault.com/?enc=BnHqAYXzfRcVfPgGgo1yOw%3D%3D.011np6%2FiCLuojl%2FBtvROkTVXr0PSdMYcYpAg2WUIE045BEFIrbCNAD42vWwIUb3d) </code></p><p>但是这种方式下载速度不是很快。</p><h3 id="方式二-直接下载打包好的源码包" tabindex="-1"><a class="header-anchor" href="#方式二-直接下载打包好的源码包"><span><strong>方式二：直接下载打包好的源码包</strong></span></a></h3><p>下载地址：<code>https://jdk.java.net/</code></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-1bbbb1f8-da01-46e1-a793-487a25193c68.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>选择你想要的版本下载即可。</p><hr><h3 id="编译前的自动配置" tabindex="-1"><a class="header-anchor" href="#编译前的自动配置"><span>编译前的自动配置</span></a></h3><p>源码包下载好，放到本地某个目录（建议路径纯英文，避免不必要的麻烦），解压之，然后进入源码根目录，执行：</p><p><code>sh configure </code></p><blockquote><p>当然这里运行的是默认配置项。</p></blockquote><p>这一步会进行一系列的自动配置工作，时间一般很快，最终如果能出现一下提示，那么很幸运，编译前的配置工作就完成了！</p><p>这里我给出我自己分别在配置<code>JDK 11</code>和<code>JDK 8</code>时候完成时的样子：</p><p><strong>配置JDK 8完成：</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-27593edc-03e2-4a42-baf3-ed5e5096b3cb.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>配置JDK 11完成：</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-8526d944-a36e-4d37-93a0-9ad4ad53f927.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>注：</strong> 如果这一步出错，大概率是某个软件环境未装，或者即使装了，但版本不匹配，控制台打印日志里一般是会提醒的。</p><p>比如我在配置<code>JDK 8</code>的时候，就遇到了一个<code>errof：GCC compiler is required</code>的问题：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-2957399f-6451-46dc-a003-76e5159265e9.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>明明系统里已经有编译器，但还是报这个错误。通过后来修改 <code>jdk源码根目录/common/autoconf/generated-configure.sh</code>文件，将相关的两行代码注释后就配置通过了</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-ffa10d36-3a77-48aa-ae0c-d3daf67f9a19.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-a6f6e416-639e-4706-8b40-6152eb3cf85d.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>配置完成，接下来开始执行真正的编译动作了！</p><hr><h2 id="真正的编译动作" tabindex="-1"><a class="header-anchor" href="#真正的编译动作"><span>真正的编译动作</span></a></h2><p>我们这里进行的是全量编译，直接在我们下载的<code>JDK</code>源码根目录下执行如下命令即可：</p><p><code>make all </code></p><p>这一步编译需要一点时间，耐心等待一下即可。编译过程如果有错误，会终止编译，如果能看到如下两个画面，那么则恭喜你，自己编译<code>JDK</code>源码就已经通过了，可以搞一杯咖啡庆祝一下了。</p><p><strong>JDK 8编译完成：</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-89020f5a-0909-4c57-8c88-f655293a42a4.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p><strong>JDK 11编译完成：</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-993fac94-2473-4f3b-9737-959510d2fe98.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>从两张图的对比可以看出，编译<code>JDK 8</code>和<code>JDK 11</code>完成时在输出上还是有区别的。时间上的区别很大程度上来源于<code>JDK 11</code>的编译机配置要高不少。</p><hr><h2 id="验证成果" tabindex="-1"><a class="header-anchor" href="#验证成果"><span>验证成果</span></a></h2><p><code>JDK</code>源码编译完成之后肯定会产生和输出很多产物，这也是我们所迫不及待想看到的。</p><p>由于<code>JDK 8</code>和<code>JDK 11</code>的源码包组织结构并不一样，所以输出东西的内容和位置也有区别。我们一一来盘点一下。</p><h3 id="_1、jdk-8的编译输出" tabindex="-1"><a class="header-anchor" href="#_1、jdk-8的编译输出"><span><strong>1、JDK 8的编译输出</strong></span></a></h3><p>编译完成，<code>build</code>目录下会生成一个<code>macosx-x86_64-normal-server-release</code>目录，所有的编译成果均位于其中。</p><p>首先，编译出来的<code>Java</code>可执行程序可以在如下目录里找到：</p><p><code>jdk源码根目录/build/macosx-x86_64-normal-server-release/jdk/bin</code></p><p>进入该目录后，可以输入<code>./java -version</code>命令验证：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-f02dff40-f27e-476c-998b-bd6cdb5d3559.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>其次，编译生成的成品<code>JDK</code>套装，可以在目录</p><p><code>jdk源码根目录/build/macosx-x86_64-normal-server-release/images </code></p><p>下找到，如图所示：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-1c781d34-776e-4acc-8d2b-b34bc59fda61.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>其中：</p><ul><li><code>j2sdk-image</code>：编译生成的JDK</li><li><code>j2re-image</code>：编译生成的JRE</li></ul><p>进入<code>j2sdk-image</code>目录会发现，里面的内容和我们平时从网络上下载的成品<code>JDK</code>内容一致。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-7b7f147e-58c9-4eb5-b407-b8984cd72e1d.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_2、jdk-11的编译输出" tabindex="-1"><a class="header-anchor" href="#_2、jdk-11的编译输出"><span><strong>2、JDK 11的编译输出</strong></span></a></h3><blockquote><p>JDK 11的源码目录组织方式和JDK 8本身就有区别，编译生成的产物和上面编译JDK 8的输出有一定区别，但也不大。</p></blockquote><p><code>JDK 11</code>编译完成，同样在<code>build</code>目录下会生成一个<code>macosx-x86_64-normal-server-release</code>目录，所有的编译成果均位于其中。</p><p>同样编译出来的Java可执行程序可以在目录</p><p><code>JDK源码根目录/build/macosx-x86_64-normal-server-release/jdk/bin</code></p><p>下看到，进入该目录后，也可以输入<code>./java -version</code>命令验证：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-f9b55425-f308-44e8-8812-ac59b2707c81.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>其次，编译生成的成品<code>JDK 11</code>套装，可以在目录</p><p><code>JDK源码根目录/build/macosx-x86_64-normal-server-release/images </code></p><p>下找到，如图所示：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-4e96858f-f681-4498-b1c4-282d317a6a32.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>其中<code>jdk</code>目录就是编译生成的成品<code>JDK 11</code>套装。</p><hr><h2 id="使用自己编译的jdk" tabindex="-1"><a class="header-anchor" href="#使用自己编译的jdk"><span>使用自己编译的JDK</span></a></h2><p>既然我们已经动手编译出了<code>JDK</code>成品，接下来我们得用上哇。</p><p>新建一个最最基本的<code>Java</code>工程，比如命名为<code>JdkTest</code>，目的是把我们自己编译出的<code>JDK</code>给用上。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-2cf54b29-9b7e-46b2-8cde-4c36960aa09b.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我们点开<code>Project Structure</code>，选到<code>SDKs</code>选项，新添加上自己刚刚编译生成的JDK，并选为项目的JDK，看看是否能正常工作</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-ad8023d0-fbb7-48b1-856e-a8818677a0a5.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-b8d87f09-6178-44c7-9572-a2852e81318d.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>点击确定之后，我们运行之：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-3164cf31-8078-46d7-bee0-22e05b0c08de.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>可以看到我们自己编译出的JDK已经用上了。</p><hr><h2 id="关联jdk源码并修改" tabindex="-1"><a class="header-anchor" href="#关联jdk源码并修改"><span>关联JDK源码并修改</span></a></h2><p>我们继续在上一步<code>JdkTest</code>项目的<code>Project Structure</code> → <code>SDKs</code>里将<code>JDK</code>源码关联到自行下载的JDK源码路径上：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-129ede68-c368-461e-92d6-38a8e5dee344.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这样方便我们对自己下载的<code>JDK源码</code>进行<strong>阅读</strong>、<strong>调试</strong>、<strong>修改</strong>、以及在源码里随意<strong>做笔记</strong>和<strong>加注释</strong>。</p><p>举个最简单的例子，比如我们打开<code>System.out.println()</code>这个函数的底层源码：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-c406b2a2-208a-4a54-a869-b3f526e93ccd.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我们随便给它修改一下，加两行简单的标记，像这样：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-2a46b215-04e5-458a-b475-4dc31d7fe326.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>为了使我们新加的代码行生效，我们必须要重新去JDK源码的根目录中再次执行 <code>make images</code>重新编译生成JDK方可生效：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-fd3cf88d-007e-4615-99b5-a3499c35ef40.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>因为之前已经全量编译过了，所以再次<code>make</code>的时候增量编译一般很快。</p><p>重新编译之后，我们再次运行<code>JdkTest</code>项目，就可以看到改动的效果了：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-33dc0de6-2690-4ba2-9fe7-0e450c44c07b.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><hr><h2 id="多行注释的问题" tabindex="-1"><a class="header-anchor" href="#多行注释的问题"><span>多行注释的问题</span></a></h2><p>记得之前搭建<a href="https://link.segmentfault.com/?enc=JrtwTM%2BhTi%2B7DiRtBYeZSQ%3D%3D.T2U2BwPhK3iqeNk%2B%2BMuGttrqlD2zy9v1C%2BqYPvIYEvcvkTe1xyPrnnb%2FdaTGkBqY" target="_blank" rel="noopener noreferrer">《JDK源码阅读环境》</a>时，大家可能发现了一个问题：阅读源码嘛，给源代码做点注释或笔记很常见！但那时候有个问题就是做注释时<strong>不可改变代码的行结构</strong>（只能行尾注释，不能跨行注释），否则debug调试时会出现<strong>行号错位</strong>的问题。</p><p>原因很简单，因为我们虽然做了源代码目录的映射，但是实际支撑运行的<code>JDK</code>还是预先安装好的那个JDK环境，并不是根据我们修改后的源码来重新编译构建的，所以看到这里，解决这个问题就很简单，就像上面一样自行编译一下<code>JDK</code>即可。</p><p>实际在实验时，还有一个很典型的问题是，当添加了多行的中文注释后，再编译居然会报错！</p><p>比如，还是以上面例子中最简单的<code>System.out.println()</code>源码为例，我们添加几行中文注释：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-d6a44833-b908-4824-8862-1679bfdddfa3.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>这时候我们去JDK源码目录下编译会发现满屏类似这样的报错：</p><blockquote><p>错误: 编码 ascii 的不可映射字符</p></blockquote><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-ad0ca5a3-36c7-477d-bd58-d6731a87d762.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>顿时有点懵，毕竟仅仅是加了几行注释。对于我们来说，源码里写点多行的中文注释基本是<strong>刚需</strong>，然而编译竟会报错，这还能不能让人愉快的玩耍了... 当时后背有点发凉。</p><p>实不相瞒，就这个问题排查了一段时间，熬到了很晚。最终折腾了一番，通过如下这种方式解决了，顺便分享给小伙伴们，大家如果遇到了这个问题，可以参考着解决一下。</p><p>因为从控制台的报错可以很明显的看出，肯定是字符编码相关的问题导致的，而且都指向了<code>ascii</code>这种编码方式。</p><p>于是将JDK的源码从根目录导入了Vs Code，然后全目录查找<code>encoding ascii</code>相关的内容，看看有没有什么端倪，结果发现</p><p><code>jdk源码根目录/make/common/SetupJavaCompilers.gmk</code>文件中有两处指定了<code>ascii</code>相关的编码方式：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-a86933af-f6d5-4d45-b4ca-33069a212c52.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>于是尝试将这两处<code>-encoding ascii</code>的均替换成<code>-encoding utf-8</code>：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-c8117faf-d027-48d3-869b-32d0e98e8372.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>然后再次执行<code>make images</code>编译，编译顺利通过！</p><p>至此大功告成！</p><p>这样后面不管是<strong>阅读</strong>、<strong>调试</strong>还是<strong>定制</strong><code>JDK</code>源码都非常方便了。</p><hr><p>引用链接：<a href="https://segmentfault.com/a/1190000023251649" target="_blank" rel="noopener noreferrer">https://segmentfault.com/a/1190000023251649</a></p><hr><p>GitHub 上标星 10000+ 的开源知识库《<a href="https://github.com/itwanger/toBeBetterJavaer" target="_blank" rel="noopener noreferrer">二哥的 Java 进阶之路</a>》第一版 PDF 终于来了！包括Java基础语法、数组&amp;字符串、OOP、集合框架、Java IO、异常处理、Java 新特性、网络编程、NIO、并发编程、JVM等等，共计 32 万余字，500+张手绘图，可以说是通俗易懂、风趣幽默……详情戳：<a href="https://javabetter.cn/overview/" target="_blank" rel="noopener noreferrer">太赞了，GitHub 上标星 10000+ 的 Java 教程</a></p><p>微信搜 <strong>沉默王二</strong> 或扫描下方二维码关注二哥的原创公众号沉默王二，回复 <strong>222</strong> 即可免费领取。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',156),r=[d];function i(n,p){return t(),a("div",null,r)}const l=e(c,[["render",i],["__file","compile-jdk.html.vue"]]),s=JSON.parse('{"path":"/jvm/compile-jdk.html","title":"自己编译JDK","lang":"zh-CN","frontmatter":{"title":"自己编译JDK","shortTitle":"自己编译JDK","category":["Java核心"],"tag":["Java虚拟机"],"description":"二哥的Java进阶之路，小白的零基础Java教程，从入门到进阶，自己编译JDK","head":[["meta",{"name":"keywords","content":"Java,JavaSE,教程,二哥的Java进阶之路,jvm,Java虚拟机,JDK"}],["meta",{"property":"og:url","content":"https://javabetter.cn/jvm/compile-jdk.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"自己编译JDK"}],["meta",{"property":"og:description","content":"二哥的Java进阶之路，小白的零基础Java教程，从入门到进阶，自己编译JDK"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-3b66d5b6-272f-47bd-88f7-47146a06ef06.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"Java虚拟机"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"自己编译JDK\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-3b66d5b6-272f-47bd-88f7-47146a06ef06.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-cd8a19ba-e9f5-4a4a-a23c-17688f0f459d.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-1bbbb1f8-da01-46e1-a793-487a25193c68.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-27593edc-03e2-4a42-baf3-ed5e5096b3cb.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-8526d944-a36e-4d37-93a0-9ad4ad53f927.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-2957399f-6451-46dc-a003-76e5159265e9.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-ffa10d36-3a77-48aa-ae0c-d3daf67f9a19.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-a6f6e416-639e-4706-8b40-6152eb3cf85d.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-89020f5a-0909-4c57-8c88-f655293a42a4.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-993fac94-2473-4f3b-9737-959510d2fe98.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-f02dff40-f27e-476c-998b-bd6cdb5d3559.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-1c781d34-776e-4acc-8d2b-b34bc59fda61.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-7b7f147e-58c9-4eb5-b407-b8984cd72e1d.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-f9b55425-f308-44e8-8812-ac59b2707c81.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-4e96858f-f681-4498-b1c4-282d317a6a32.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-2cf54b29-9b7e-46b2-8cde-4c36960aa09b.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-ad8023d0-fbb7-48b1-856e-a8818677a0a5.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-b8d87f09-6178-44c7-9572-a2852e81318d.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-3164cf31-8078-46d7-bee0-22e05b0c08de.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-129ede68-c368-461e-92d6-38a8e5dee344.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-c406b2a2-208a-4a54-a869-b3f526e93ccd.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-2a46b215-04e5-458a-b475-4dc31d7fe326.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-fd3cf88d-007e-4615-99b5-a3499c35ef40.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-33dc0de6-2690-4ba2-9fe7-0e450c44c07b.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-d6a44833-b908-4824-8862-1679bfdddfa3.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-ad0ca5a3-36c7-477d-bd58-d6731a87d762.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-a86933af-f6d5-4d45-b4ca-33069a212c52.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/compile-jdk-c8117faf-d027-48d3-869b-32d0e98e8372.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":2,"title":"环境准备","slug":"环境准备","link":"#环境准备","children":[{"level":3,"title":"1、boot JDK","slug":"_1、boot-jdk","link":"#_1、boot-jdk","children":[]},{"level":3,"title":"2、Unix环境","slug":"_2、unix环境","link":"#_2、unix环境","children":[]},{"level":3,"title":"3、编译器/编译工具链","slug":"_3、编译器-编译工具链","link":"#_3、编译器-编译工具链","children":[]},{"level":3,"title":"4、其他工具","slug":"_4、其他工具","link":"#_4、其他工具","children":[]}]},{"level":2,"title":"下载JDK源码","slug":"下载jdk源码","link":"#下载jdk源码","children":[{"level":3,"title":"方式一：通过Mercurial工具下载","slug":"方式一-通过mercurial工具下载","link":"#方式一-通过mercurial工具下载","children":[]},{"level":3,"title":"方式二：直接下载打包好的源码包","slug":"方式二-直接下载打包好的源码包","link":"#方式二-直接下载打包好的源码包","children":[]},{"level":3,"title":"编译前的自动配置","slug":"编译前的自动配置","link":"#编译前的自动配置","children":[]}]},{"level":2,"title":"真正的编译动作","slug":"真正的编译动作","link":"#真正的编译动作","children":[]},{"level":2,"title":"验证成果","slug":"验证成果","link":"#验证成果","children":[{"level":3,"title":"1、JDK 8的编译输出","slug":"_1、jdk-8的编译输出","link":"#_1、jdk-8的编译输出","children":[]},{"level":3,"title":"2、JDK 11的编译输出","slug":"_2、jdk-11的编译输出","link":"#_2、jdk-11的编译输出","children":[]}]},{"level":2,"title":"使用自己编译的JDK","slug":"使用自己编译的jdk","link":"#使用自己编译的jdk","children":[]},{"level":2,"title":"关联JDK源码并修改","slug":"关联jdk源码并修改","link":"#关联jdk源码并修改","children":[]},{"level":2,"title":"多行注释的问题","slug":"多行注释的问题","link":"#多行注释的问题","children":[]}],"git":{},"readingTime":{"minutes":11.25,"words":3375},"filePathRelative":"jvm/compile-jdk.md","excerpt":"\\n<p>很多小伙伴们做<code>Java</code>开发，天天写<code>Java</code>代码，肯定离不开<code>Java</code>基础环境：<code>JDK</code>，毕竟我们写好的<code>Java</code>代码也是跑在<code>JVM</code>虚拟机上。</p>\\n<p>一般来说，我们学<code>Java</code>之前，第一步就是安装<code>JDK</code>环境。这个简单啊，我们一般直接把<code>JDK</code>从官网下载下来，安装完成，配个环境变量就可以愉快地使用了。</p>\\n<p>不过话说回来，对于这个天天使用的东西，我们难道不好奇这玩意儿它到底是怎么由源码编译出来的吗？</p>"}');export{l as comp,s as data};
