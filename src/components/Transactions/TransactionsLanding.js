import React from "react";
import Transactions from "./Transactions";
import AddTransaction from "./AddTransaction";
import EditTransaction from "./EditTransaction";
import axios from "axios";

const apiUrl = "http://localhost:9000/api/transactions";

class TransactionsLanding extends React.Component {
  constructor() {
    super();
    this.state = {
      transactions: [],
      showAddTransaction: false,
      showEditTransaction: false,
    };

    this.onAddButtonClick = this.onAddButtonClick.bind(this);
    this.onAddTransaction = this.onAddTransaction.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.onDeleteTransaction = this.onDeleteTransaction.bind(this);
    this.onEditTransaction = this.onEditTransaction.bind(this);
    this.onCancelEdit = this.onCancelEdit.bind(this);
    this.onSubmitEdit = this.onSubmitEdit.bind(this);
  }

  componentDidMount() {
    this.getTransactions();
  }

  // Get transactions from the API
  getTransactions() {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          transactions: data,
        })
      )
      .catch(function (err) {
        console.log(err);
      });
  }

  // Show add transaction modal when clicked
  onAddButtonClick() {
    this.setState((prevState) => ({
      showAddTransaction: !prevState.showAddTransaction,
    }));
  }

  // Post the new transaction, get transactions from API to update table
  async onAddTransaction(transaction) {
    await axios.post(apiUrl, transaction).then(
      this.setState((prevState) => ({
        showAddTransaction: !prevState.showAddTransaction,
      }))
    );
    this.getTransactions();
  }

  onDeleteTransaction(id, i) {
    // Delete transaction by id
    fetch(`${apiUrl}/${id}`, {
      method: "delete",
    })
      .then((response) => response.json())
      .then(() => {
        var newTransactions = [...this.state.transactions]; // Create copy of transactions
        newTransactions.splice(i, 1); // Remove deleted transaction
        this.setState({ transactions: newTransactions }); // Set state to new transactions
      })
      .catch((err) => {
        console.log(err);
      });
    this.getTransactions();
  }

  // When user clicks the Edit button
  onEditTransaction(id) {
    fetch(`${apiUrl}/${id}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          showEditTransaction: true,
          transactionToEdit: {
            id: id,
            date: data.date,
            description: data.description,
            amount: data.amount,
            isSpending: data.isSpending,
          },
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  // When user finishes editing a transaction
  async onSubmitEdit(id, transaction) {
    await axios.put(`${apiUrl}/${id}`, transaction).then(
      this.setState((prevState) => ({
        showEditTransaction: false,
        transactionToEdit: {},
      }))
    );
    this.getTransactions();
  }

  onCancelEdit() {
    this.setState({
      showEditTransaction: false,
      transactionToEdit: {},
    });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <div className="container">
          <div className="add-transaction">
            {this.state.showAddTransaction ? (
              <AddTransaction onAddTransaction={this.onAddTransaction} />
            ) : (
              <button
                onClick={this.onAddButtonClick}
                className="button-primary"
              >
                Add Transaction
              </button>
            )}
          </div>
          <div className="transaction-table">
            {this.state.showEditTransaction ? (
              <EditTransaction
                transaction={this.state.transactionToEdit}
                onCancelEdit={this.onCancelEdit}
                onSubmitEdit={this.onSubmitEdit}
              />
            ) : null}
            <Transactions
              transactions={this.state.transactions}
              onDelete={this.onDeleteTransaction}
              onEdit={this.onEditTransaction}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default TransactionsLanding;