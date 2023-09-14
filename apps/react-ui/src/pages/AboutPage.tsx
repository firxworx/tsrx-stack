import { PageHeading } from '../layout/PageLayout'

export function AboutPage(): JSX.Element {
  return (
    <>
      <PageHeading title="About" />
      <div className="prose">
        <p>This is a simple page with dummy copy.</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut velit nisl. Nunc tellus urna, ornare sed
          lacinia at, imperdiet ut orci. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
          inceptos himenaeos. Mauris porttitor elit ipsum, ut porta purus iaculis eget. Vivamus rhoncus ipsum dui, non
          elementum enim luctus et. Cras nec leo laoreet, facilisis massa quis, suscipit nulla. In hac habitasse platea
          dictumst. Sed eu nibh vel urna consectetur pretium.
        </p>
        <p>
          Integer consequat mi at eros pretium ultrices. Suspendisse potenti. Proin eget orci nibh. Maecenas pulvinar
          odio odio, sed porttitor lorem pretium eu. Maecenas odio ex, tempor ut urna sit amet, rhoncus malesuada arcu.
          Suspendisse tristique ex vel scelerisque posuere. Proin fringilla ut metus sed imperdiet. Sed a odio eget eros
          congue luctus eu nec odio. Mauris non sapien neque. Vestibulum venenatis odio fringilla libero euismod
          lobortis. Vestibulum aliquet mi in sapien lacinia, in rutrum arcu elementum. Nunc ac tortor viverra, imperdiet
          nisi sit amet, hendrerit turpis. Phasellus tincidunt tortor sit amet pulvinar luctus. Nam porta placerat enim
          nec aliquam. Duis condimentum blandit ultrices. Suspendisse auctor ante ligula, sollicitudin dapibus mauris
          tempor eget.
        </p>
      </div>
    </>
  )
}
