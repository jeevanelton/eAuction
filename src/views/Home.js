import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
} from "reactstrap";

const Home = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Bank Auctions Made Easy & Convenient</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            With Bank eAuctions, Banks can create and publish events in few easy
            steps and monitor the entire process online.
          </CardText>
          <CardText>
            The easy to use interface requires minimal training to the bank
            users and bidders
            {/* <CardLink
              href="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/"
              target="_blank"
            >
              Template Documentation
            </CardLink> */}
          </CardText>
        </CardBody>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Want to integrate JWT? 🔒</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            We carefully crafted JWT flow so you can implement JWT with ease and
            with minimum efforts.
          </CardText>
          <CardText>
            Please read our{" "}
            <CardLink
              href="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/development/auth"
              target="_blank"
            >
              JWT Documentation
            </CardLink>{" "}
            to get more out of JWT authentication.
          </CardText>
        </CardBody>
      </Card> */}
    </div>
  );
};

export default Home;
