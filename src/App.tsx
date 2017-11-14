import "babel-polyfill";
import "brace";
import "brace/mode/glsl";
import "brace/theme/monokai";
import "grimoirejs-preset-basic/register";
import Button from "material-ui/Button";
import * as React from "react";
import AceEditor from "react-ace";
import styled from "styled-components";
const goml = `
<goml>
  <import-material typeName="mat" src="./material.sort"/>
  <renderer>
    <render-quad material="new(mat)"/>
  </renderer>
</goml>
`;
const sort = `@Pass{
  @BlendFunc(ONE,ONE)
  FS_PREC(mediump,float)
  #ifdef VS
    attribute vec3 position;
    uniform mat4 _matPVM;
    uniform float _time;
    void main(){
      gl_Position = _matPVM * vec4(position, 1.);
    }
  #endif
  #ifdef FS
    void main(){
      gl_FragColor = vec4(0.,1.,0.,1.);
    }
  #endif
}
`;

const Div = styled.div`
  width:80vw;
  height:80vh;
  margin:auto;
  padding:50px 0;
`;
const ButtonWrapper = styled.div`
  display:inline-block;
`;
class App extends React.Component {
  public componentDidMount() {
    const script = document.createElement("script");
    const wrapped = document.createElement("div");
    wrapped.setAttribute("id", "gr-container-wrapper");
    script.setAttribute("type", "text/goml");
    script.setAttribute("id", "main");
    script.innerHTML = goml;
    wrapped.appendChild(script);
    document.body.appendChild(wrapped);
  }
  public render() {
    return (
      <div className="App">
        <ButtonWrapper>
          <Button raised={true}>Reload Material</Button>
        </ButtonWrapper>
        <Div>
          <AceEditor
            mode="glsl"
            theme="monokai"
            height="100%"
            commands={[{
              name: "commandName",
              bindKey: { win: "Ctrl-S", mac: "Command-S" },
              exec: () => { console.log("key-binding used"); },
            }]}
            tabSize={2}
            defaultValue={sort}
            onChange={this._onChange}
            editorProps={{ $blockScrolling: true }}
          />

        </Div>
      </div>
    );
  }
  private async _onChange(value: string): Promise<void> {
    const gr = (window as any).GrimoireJS;
    const Parser = gr.lib.fundamental.Sort.Parser;
    const Material = gr.lib.fundamental.Material.Material;
    const obj = await Parser.parse(value);
    const gl = gr("#main").rootNodes[0].companion.get("gl");
    const material = new Material(gl, obj);
    gr("#main")("render-quad").setAttribute("material", material);
  }
}

export default App;
